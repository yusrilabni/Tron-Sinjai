/**
 * SISTEM PORTAL VIDEOTRON SINJAI - BACKEND (Google Apps Script)
 * @OnlyCurrentDoc
 * @include https://www.googleapis.com/auth/drive
 */

const CONFIG = {
  SPREADSHEET_ID: SpreadsheetApp.getActiveSpreadsheet().getId(),
  DRIVE_FOLDER_ID: '15oLjsSDkY4NtGCzKwyVlLSkRGZ7UCh2F', 
  TELEGRAM: {
    TOKEN: '8850012352:AAEffY8j5brh3gZjAgoLpTxdRObITnLKPs0',
    CHAT_ID: '-5553804915'
  }
};

// --- SETUP OTOMATIS ---

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚙️ System Portal')
      .addItem('Setup Database Otomatis', 'setupSheets')
      .addToUi();
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = {
    // Kolom 18: Allow Edit, Kolom 19: MimeType
    'Pengajuan_Berbayar': ["No Registrasi", "Tanggal", "Jenis", "Instansi", "PIC", "HP", "Email", "Judul", "Kategori", "URL File", "Status", "Catatan", "Durasi", "Satuan", "Tanggal Mulai", "Total Biaya", "URL Dokumentasi", "Allow Edit", "MimeType"],
    'Pengajuan_OPD': ["No Registrasi", "Tanggal", "Jenis", "Instansi", "PIC", "HP", "Email", "Judul", "Kategori", "URL File", "Status", "Catatan", "Durasi", "Satuan", "Tanggal Mulai", "Total Biaya", "URL Dokumentasi", "Allow Edit", "MimeType"],
    'Users_Admin': ["username", "password", "role"],
    'Jadwal': ["No Registrasi", "Tanggal Mulai", "Tanggal Selesai", "Keterangan"],
    'Log': ["Timestamp", "User", "Action", "Details"],
    'Gallery': ["ID", "Tanggal", "Judul", "URL", "Tipe", "Status", "Jenis"],
    'Settings': ["Key", "Value", "Description"]
  };
  
  for (let sheetName in sheets) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    const headers = sheets[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#efefef');
    sheet.setFrozenRows(1);
  }
  
  const userSheet = ss.getSheetByName('Users_Admin');
  if (userSheet.getLastRow() === 1) {
    userSheet.appendRow(['admin', 'admin123', 'superadmin']);
  }

  const settingsSheet = ss.getSheetByName('Settings');
  if (settingsSheet.getLastRow() === 1) {
    settingsSheet.appendRow(['CONTACT_LIST', '[]', 'Daftar Kontak Admin (JSON)']);
    settingsSheet.appendRow(['PRICE_PER_DAY', '50000', 'Biaya penayangan per hari (Rupiah)']);
  }
  
  SpreadsheetApp.getUi().alert('✅ Setup Database Berhasil!');
}

// --- API HANDLERS ---

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Validasi token untuk aksi admin
    const adminActions = ['uploadGallery', 'updateSubmissionStatus', 'deleteSubmission', 'deleteGalleryItem', 'resetSubmissions', 'updateSettings', 'createGroup', 'updateGroupItems', 'deleteGroup'];
    let adminUser = "SYSTEM";
    if (adminActions.indexOf(action) !== -1) {
      const activeUser = validateAdminToken(data.admin_token);
      if (!activeUser) {
        return response({ success: false, message: 'Akses ditolak: Sesi Anda telah berakhir atau tidak sah.' });
      }
      adminUser = activeUser;
    }

    switch(action) {
      case 'submitPengajuan': return handlePengajuan(data.payload);
      case 'uploadChunk': return handleChunkUpload(data.payload);
      case 'assembleChunkFile': return handleAssembleFile(data.payload);
      case 'updateSubmission': return handleUpdateSubmission(data.payload);
      case 'adminLogin': return handleLogin(data.payload);
      case 'uploadGallery': return handleUploadGallery(data.payload, adminUser);
      case 'updateSubmissionStatus': return handleUpdateStatus(data.payload, adminUser);
      case 'deleteSubmission': return handleDeleteSubmission(data.payload.no_registrasi, adminUser);
      case 'deleteGalleryItem': return handleDeleteGalleryItem(data.payload.id, adminUser);
      case 'resetSubmissions': return handleResetSubmissions(adminUser);
      case 'updateSettings': return handleUpdateSettings(data.payload, adminUser);
      case 'createGroup': return handleCreateGroup(data.payload, adminUser);
      case 'updateGroupItems': return handleUpdateGroupItems(data.payload, adminUser);
      case 'deleteGroup': return handleDeleteGroup(data.payload, adminUser);
      default: throw new Error('Action tidak dikenal: ' + action);
    }
  } catch (err) { return response({ success: false, message: "Server POST Error: " + err.toString() }); }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    // Validasi token untuk GET request admin
    const adminGetActions = ['getSubmissions', 'getSettings', 'getLogs'];
    if (adminGetActions.indexOf(action) !== -1) {
      const activeUser = validateAdminToken(e.parameter.admin_token);
      if (!activeUser) {
        return response({ success: false, message: 'Akses ditolak: Sesi Anda telah berakhir atau tidak sah.' });
      }
    }

    if (action === 'checkStatus') return handleCheckStatus(e.parameter.no_registrasi);
    if (action === 'getGallery') return handleGetGallery();
    if (action === 'getGroups') return handleGetGroups();
    if (action === 'getSubmissions') return handleGetSubmissions();
    if (action === 'getPublicLogs') return handleGetPublicLogs();
    if (action === 'getSettings') return handleGetSettings();
    if (action === 'getLogs') return handleGetLogs();
    return response({ success: false, message: 'Invalid GET request' });
  } catch (err) { return response({ success: false, message: "Server GET Error: " + err.toString() }); }
}

function getSessionsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Sessions_Admin');
  if (!sheet) {
    sheet = ss.insertSheet('Sessions_Admin');
    sheet.appendRow(['Token', 'Username', 'Expires']);
    sheet.getRange("C:C").setNumberFormat("@"); // Force C column (Expires) to be Plain Text format
  }
  return sheet;
}

function validateAdminToken(token) {
  if (!token) return null;
  try {
    const sheet = getSessionsSheet();
    const data = sheet.getDataRange().getValues();
    const now = new Date().getTime();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === token) {
        const expVal = data[i][2] ? data[i][2].toString().trim() : "";
        const expires = Number(expVal) || 0;
        if (now <= expires) {
          return data[i][1]; // return username
        } else {
          sheet.deleteRow(i + 1);
          return null;
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// --- LOGIKA UTAMA ---

function getSettingsData() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    const data = sheet.getDataRange().getValues();
    const settings = {};
    for (let i = 1; i < data.length; i++) {
      let val = data[i][1];
      if (data[i][0] === 'CONTACT_LIST' && val) {
        try { val = JSON.parse(val); } catch(e) { val = []; }
      }
      settings[data[i][0]] = val;
    }
    return settings;
  } catch(e) { return { PRICE_PER_DAY: "0", CONTACT_LIST: [] }; }
}

function getAllSubmissionData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['Pengajuan_Berbayar', 'Pengajuan_OPD'];
  let allData = [];
  
  sheets.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return;

    for (let i = 1; i < data.length; i++) {
      let status = data[i][10];
      const tglMulaiStr = data[i][14]; // KOLOM 15: Tanggal Mulai
      const durasi = parseInt(data[i][12]) || 0;
      const satuan = data[i][13];
      
      let sisaHari = 0;
      let isExpired = false;
      let shouldHideFromPublic = false;

      if (tglMulaiStr && (status === 'TAYANG' || status === 'DISETUJUI' || status === 'EXPIRED')) {
        try {
          const parsedStart = safeParseDate(tglMulaiStr);
          if (!parsedStart) throw new Error("Format tanggal mulai tidak valid: " + tglMulaiStr);
          
          const tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || "GMT+7";
          const todayStr = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
          const startStr = Utilities.formatDate(parsedStart, tz, "yyyy-MM-dd");
          
          const today = new Date(todayStr.replace(/-/g, '/'));
          const start = new Date(startStr.replace(/-/g, '/'));
          
          if (satuan === 'SELAMANYA') {
            sisaHari = 99999;
            isExpired = false;
            if (status === 'DISETUJUI' && today.getTime() >= start.getTime()) {
               sheet.getRange(i + 1, 11).setValue('TAYANG');
               status = 'TAYANG';
            }
          } else {
            let multiplier = 1;
            if (satuan === 'MINGGU') multiplier = 7;
            if (satuan === 'BULAN') multiplier = 30;
            if (satuan === 'TAHUN') multiplier = 365;
            
            if (status === 'DISETUJUI' && today.getTime() >= start.getTime()) {
               sheet.getRange(i + 1, 11).setValue('TAYANG');
               status = 'TAYANG';
            }
            
            // Tanggal Selesai = Tanggal Mulai + Total Hari Durasi
            const end = new Date(start.getTime() + (durasi * multiplier * 24 * 60 * 60 * 1000));
            const diffTime = end.getTime() - today.getTime();
            
            if (status === 'DISETUJUI') {
              sisaHari = durasi * multiplier;
            } else {
              // SISA HARI = Math.floor (Jika selisih 0 jam, maka sisa 0 hari = EXPIRED)
              sisaHari = Math.floor(diffTime / (24 * 60 * 60 * 1000));
            }
            
            if (status === 'EXPIRED') {
              isExpired = true;
              sisaHari = 0;
              if (diffTime !== 0) {
                shouldHideFromPublic = true;
              }
            } else if (status === 'TAYANG' && sisaHari <= 0) {
              isExpired = true;
              if (status !== 'EXPIRED') {
                 sheet.getRange(i + 1, 11).setValue('EXPIRED');
                 status = 'EXPIRED';
              }
              // Sembunyikan hanya jika sudah lewat 24 jam dari kadaluarsa (sisaHari < 0)
              if (sisaHari < 0) shouldHideFromPublic = true;
              sisaHari = 0;
            }
          }
        } catch(e) {
          writeLog("SYSTEM", "DATE_ERROR", "Error parsing date '" + tglMulaiStr + "': " + e.toString());
        }
      }

      allData.push({
        no_registrasi: data[i][0],
        tanggal: data[i][1],
        jenis: data[i][2],
        instansi: data[i][3],
        pic: data[i][4],
        hp: data[i][5],
        email: data[i][6],
        judul: data[i][7],
        kategori: data[i][8],
        url: data[i][9],
        status: status,
        catatan: data[i][11],
        durasi: durasi,
        satuan: satuan,
        tanggal_mulai: data[i][14],
        biaya: data[i][15],
        url_dokumentasi: data[i][16] || "",
        allow_edit: data[i][17] === "YES",
        mimeType: data[i][18] || "",
        sisa_hari: sisaHari,
        is_expired: isExpired,
        should_hide: shouldHideFromPublic,
        _sheetName: name,
        _rowIdx: i + 1
      });
    }
  });
  return allData;
}

function handleGetPublicLogs() {
  const data = getAllSubmissionData();
  const result = data.map(d => ({
    no_registrasi: d.no_registrasi,
    tanggal: d.tanggal,
    instansi: d.instansi,
    pic: maskPrivacy(d.pic, 'name'),
    email: maskPrivacy(d.email, 'email'),
    judul: d.judul,
    status: d.status,
    catatan: d.catatan,
    allow_edit: d.allow_edit
  }));
  return response({ success: true, data: result.reverse() });
}

function handleGetSubmissions() {
  const data = getAllSubmissionData();
  return response({ success: true, data: data.reverse() });
}

function handleGetLogs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log');
  const data = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < data.length; i++) {
    result.push({ timestamp: data[i][0], user: data[i][1], action: data[i][2], details: data[i][3] });
  }
  return response({ success: true, data: result.reverse() });
}

function writeLog(user, action, details) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log');
    sheet.appendRow([new Date(), user.toString().toUpperCase(), action, details]);
  } catch (e) {}
}

function handleUpdateStatus(payload, adminUser) {
  const data = getAllSubmissionData();
  const target = data.find(d => d.no_registrasi === payload.no_registrasi);
  
  if (target) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(target._sheetName);
    sheet.getRange(target._rowIdx, 11).setValue(payload.status);
    sheet.getRange(target._rowIdx, 12).setValue(payload.catatan || '');
    sheet.getRange(target._rowIdx, 18).setValue(payload.allow_edit ? "YES" : "NO");
    
    if (payload.tanggal_mulai) {
      sheet.getRange(target._rowIdx, 15).setValue(payload.tanggal_mulai);
    }
    if (payload.durasi !== undefined && payload.durasi !== null && payload.durasi !== '') {
      sheet.getRange(target._rowIdx, 13).setValue(parseInt(payload.durasi) || 0);
    }
    if (payload.satuan) {
      sheet.getRange(target._rowIdx, 14).setValue(payload.satuan);
    }
    
    if (payload.docUrlDirect) {
      sheet.getRange(target._rowIdx, 17).setValue(payload.docUrlDirect);
    } else if (payload.docBase64) {
      const docFileName = `DOC_${payload.no_registrasi}_${Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmm")}`;
      const docUrl = uploadToDrive(payload.docBase64, docFileName, payload.docMimeType);
      sheet.getRange(target._rowIdx, 17).setValue(docUrl);
    }
    
    writeLog(adminUser, "UPDATE_STATUS", `ID: ${payload.no_registrasi} -> ${payload.status} (AllowEdit: ${payload.allow_edit})`);
    return response({ success: true });
  }
  return response({ success: false, message: 'Data tidak ditemukan' });
}

function handleUpdateSubmission(payload) {
  try {
    const data = getAllSubmissionData();
    const target = data.find(d => d.no_registrasi === payload.no_registrasi);
    
    if (!target) throw new Error("Data tidak ditemukan");
    if (!target.allow_edit) throw new Error("Akses edit tidak diizinkan oleh admin");
    
    let fileUrl = payload.fileUrl || "";
    let mimeType = payload.mimeType || "";

    if (payload.isLinkSubmission && fileUrl) {
      const driveDetails = validateAndGetDriveFileDetails(fileUrl);
      if (!driveDetails.success) {
        return response({ success: false, message: driveDetails.message });
      }
      mimeType = driveDetails.mimeType;
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(target._sheetName);
    sheet.getRange(target._rowIdx, 8).setValue(payload.judul);
    sheet.getRange(target._rowIdx, 9).setValue(payload.kategori);
    sheet.getRange(target._rowIdx, 15).setValue(payload.tanggal_mulai);
    if (fileUrl) {
      sheet.getRange(target._rowIdx, 10).setValue(fileUrl);
      if (mimeType) sheet.getRange(target._rowIdx, 19).setValue(mimeType);
    }
    
    sheet.getRange(target._rowIdx, 11).setValue('MENUNGGU_VERIFIKASI');
    sheet.getRange(target._rowIdx, 18).setValue('NO');
    
    writeLog("SYSTEM", "EDIT_SUBMISSION", `User melakukan perbaikan data pada ID: ${payload.no_registrasi}`);

    try {
      const msg = `🔄 *Perbaikan Pengajuan*\n\n` +
                  `*No. Registrasi:* \`${payload.no_registrasi}\`\n` +
                  `*Instansi:* ${target.instansi || '-'}\n` +
                  `*Judul Baru:* ${payload.judul}\n` +
                  `*Kategori Baru:* ${payload.kategori}\n` +
                  `*Tanggal Mulai Baru:* ${payload.tanggal_mulai}\n\n` +
                  `Silakan lakukan verifikasi ulang pada Dashboard Admin.`;
      sendTelegram(msg);
    } catch (telegramErr) {}

    return response({ success: true });
  } catch (err) {
    return response({ success: false, message: "Update Error: " + err.toString() });
  }
}

function handleAssembleFile(payload) {
  try {
    const cache = CacheService.getScriptCache();
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    let combinedBase64 = "";
    for (let i = 0; i < payload.totalChunks; i++) {
      const data = cache.get("chunk_" + payload.uploadId + "_" + i);
      if (!data) throw new Error("Potongan file ke-" + i + " hilang.");
      const base64Part = data.split(',')[1] || data;
      combinedBase64 += base64Part;
      cache.remove("chunk_" + payload.uploadId + "_" + i);
    }
    const decoded = Utilities.base64Decode(combinedBase64);
    const blob = Utilities.newBlob(decoded, payload.mimeType, payload.fileName);
    const file = folder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (sharingErr) {
      console.warn("Gagal menyetel sharing link (batasan Google Workspace): " + sharingErr.toString());
    }
    return response({ success: true, fileUrl: file.getUrl() });
  } catch (err) {
    return response({ success: false, message: "Assembly Error: " + err.toString() });
  }
}

function handlePengajuan(payload) {
  try {
    if (payload.formMode === 'FORM_STANDARD' && (parseInt(payload.durasi) || 0) > 3) {
      return response({ success: false, message: 'Durasi penayangan Formulir Publik maksimal 3 hari!' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = payload.jenis === 'BERBAYAR' ? 'Pengajuan_Berbayar' : 'Pengajuan_OPD';
    const sheet = ss.getSheetByName(sheetName);
    const noReg = generateNoReg();
    let fileUrl = payload.fileUrl || "";
    let mimeType = payload.mimeType || "";

    if (payload.isLinkSubmission && fileUrl) {
      const driveDetails = validateAndGetDriveFileDetails(fileUrl);
      if (!driveDetails.success) {
        return response({ success: false, message: driveDetails.message });
      }
      mimeType = driveDetails.mimeType;
    } else if (!fileUrl && payload.fileBase64) {
      const sanitizedTitle = payload.judul.substring(0, 30).replace(/[^a-z0-9]/gi, '-');
      const uniqueId = Math.random().toString(36).substr(2, 5).toUpperCase();
      const extension = payload.fileName.split('.').pop() || 'file';
      const fileName = `REG_${sanitizedTitle}_${uniqueId}_${Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmm")}.${extension}`;
      fileUrl = uploadToDrive(payload.fileBase64, fileName, payload.mimeType);
      mimeType = payload.mimeType || "";
    }

    let biayaTotal = 0;
    if (payload.jenis === 'BERBAYAR') {
      const settings = getSettingsData();
      const price = parseInt(settings.PRICE_PER_DAY) || 0;
      let multiplier = 1;
      if (payload.satuan === 'MINGGU') multiplier = 7;
      if (payload.satuan === 'BULAN') multiplier = 30;
      if (payload.satuan === 'TAHUN') multiplier = 365;
      biayaTotal = (parseInt(payload.durasi) || 0) * multiplier * price;
    }
    
    const targetStatus = payload.status || 'MENUNGGU_VERIFIKASI';
    const picName = payload.pic || 'ADMINISTRATOR';
    const hpNumber = payload.hp || '62';
    const emailAddr = payload.email || 'admin@sinjaikab.go.id';

    // rowData (KOLOM 15: payload.tanggal_mulai HARUS ASLI DARI FORM)
    const rowData = [noReg, new Date(), payload.jenis, payload.instansi, picName, hpNumber, emailAddr, payload.judul, payload.kategori, fileUrl, targetStatus, '', payload.durasi || 0, payload.satuan || 'HARI', payload.tanggal_mulai, biayaTotal, "", "NO", mimeType];
    sheet.appendRow(rowData);

    if (payload.status) {
      writeLog("ADMIN", "MANUAL_UPLOAD", `ID: ${noReg} - Judul: ${payload.judul} (${payload.jenis}) -> Status: ${targetStatus}`);
    }

    try {
      const isPublic = payload.status ? 'Upload Manual Admin' : 'Pendaftaran Publik/OPD';
      const formatBiaya = (biayaTotal ? biayaTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0");
      const msg = `🔔 *Pengajuan Baru (${isPublic})*\n\n` +
                  `*No. Registrasi:* \`${noReg}\`\n` +
                  `*Instansi:* ${payload.instansi}\n` +
                  `*PIC:* ${picName} (${hpNumber})\n` +
                  `*Judul:* ${payload.judul}\n` +
                  `*Kategori:* ${payload.kategori}\n` +
                  `*Jenis:* ${payload.jenis}\n` +
                  `*Durasi:* ${payload.durasi || 0} ${payload.satuan || 'HARI'}\n` +
                  `*Tanggal Mulai:* ${payload.tanggal_mulai}\n` +
                  `*Biaya:* Rp ${formatBiaya}\n\n` +
                  `Silakan lakukan verifikasi pada dashboard admin.`;
      sendTelegram(msg);
    } catch (telegramErr) {}

    return response({ success: true, no_registrasi: noReg, total_biaya: biayaTotal });
  } catch (err) { return response({ success: false, message: "Submit Error: " + err.toString() }); }
}

function handleGetGallery() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = [];
  const galSheet = ss.getSheetByName('Gallery');
  const galData = galSheet.getDataRange().getValues();
  for (let i = 1; i < galData.length; i++) {
    if (galData[i][5] === 'PUBLISH') {
      result.push({ id: galData[i][0].toString(), tanggal: galData[i][1], judul: galData[i][2], url: galData[i][3], tipe: galData[i][4], source: 'GALLERY', status: galData[i][5], sisa_hari: 999, jenis: galData[i][6] || 'OPD' });
    }
  }
  const allSubmissions = getAllSubmissionData();
  allSubmissions.forEach(sub => {
    if ((sub.status === 'TAYANG' || sub.status === 'DISETUJUI' || sub.status === 'EXPIRED') && !sub.should_hide) {
      const isVideo = (sub.mimeType && sub.mimeType.toLowerCase().includes('video')) || (sub.url && sub.url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/));
      result.push({ 
        id: sub.no_registrasi.toString(), 
        tanggal: sub.tanggal, 
        judul: sub.judul, 
        url: sub.url, 
        tipe: isVideo ? 'VIDEO' : 'IMAGE', 
        source: 'SUBMISSION', 
        status: sub.status,
        jenis: sub.jenis,
        tanggal_mulai: sub.tanggal_mulai,
        durasi: sub.durasi,
        satuan: sub.satuan,
        catatan: sub.catatan,
        sisa_hari: sub.sisa_hari, 
        is_expired: sub.is_expired 
      });
    }
  });
  return response({ success: true, data: result.sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()) });
}

function handleUploadGallery(payload, adminUser) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gallery');
  let fileUrl = payload.fileUrl || "";
  let mimeType = payload.mimeType || "";

  if (payload.isLinkSubmission && fileUrl) {
    const driveDetails = validateAndGetDriveFileDetails(fileUrl);
    if (!driveDetails.success) {
      return response({ success: false, message: driveDetails.message });
    }
    mimeType = driveDetails.mimeType;
  } else if (!fileUrl && payload.fileBase64) {
    const sanitizedTitle = payload.judul.substring(0, 30).replace(/[^a-z0-9]/gi, '-');
    const uniqueId = Math.random().toString(36).substr(2, 5).toUpperCase();
    const fileName = `GAL_${sanitizedTitle}_${uniqueId}_${Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmm")}`;
    fileUrl = uploadToDrive(payload.fileBase64, fileName, payload.mimeType);
    mimeType = payload.mimeType || "";
  }
  const id = "GAL-" + new Date().getTime();
  const rowData = [id, new Date(), payload.judul, fileUrl, mimeType.includes('video') ? 'VIDEO' : 'IMAGE', 'PUBLISH', payload.jenis || 'OPD'];
  sheet.appendRow(rowData);
  writeLog(adminUser, "UPLOAD_GALLERY", `Judul: ${payload.judul} (${payload.jenis || 'OPD'})`);
  return response({ success: true });
}

function uploadToDrive(base64, name, type) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const data = Utilities.base64Decode(base64.split(',')[1]);
    const blob = Utilities.newBlob(data, type, name);
    const file = folder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (sharingErr) {
      console.warn("Gagal menyetel sharing link (batasan Google Workspace): " + sharingErr.toString());
    }
    return file.getUrl();
  } catch(e) { throw new Error("Drive Upload: " + e.toString()); }
}

function handleDeleteSubmission(noReg, adminUser) {
  const data = getAllSubmissionData();
  const target = data.find(d => d.no_registrasi === noReg);
  if (target) {
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(target._sheetName).deleteRow(target._rowIdx);
    writeLog(adminUser, "DELETE_DATA", `ID: ${noReg}`);
    return response({ success: true });
  }
  return response({ success: false, message: 'Data tidak ditemukan' });
}

function handleResetSubmissions(adminUser) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ['Pengajuan_Berbayar', 'Pengajuan_OPD'].forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet && sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  });
  try {
    const files = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID).getFiles();
    while (files.hasNext()) files.next().setTrashed(true);
  } catch (e) {}
  writeLog(adminUser, "RESET_SYSTEM", "Database & Drive dikosongkan");
  return response({ success: true });
}

function handleCheckStatus(noReg) {
  const data = getAllSubmissionData();
  const target = data.find(d => d.no_registrasi === noReg);
  if (target) return response({ success: true, data: target });
  return response({ success: false, message: 'Nomor Registrasi tidak ditemukan' });
}

function handleGetSettings() { return response({ success: true, data: getSettingsData() }); }

function handleUpdateSettings(payload, adminUser) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    if (payload[key] !== undefined) {
      let val = payload[key];
      if (key === 'CONTACT_LIST') val = JSON.stringify(val);
      sheet.getRange(i + 1, 2).setValue(val);
    }
  }
  writeLog(adminUser, "UPDATE_SETTINGS", "Konfigurasi sistem diubah");
  return response({ success: true });
}

function handleChunkUpload(payload) {
  try {
    const cache = CacheService.getScriptCache();
    const chunkKey = "chunk_" + payload.uploadId + "_" + payload.chunkIndex;
    cache.put(chunkKey, payload.chunkData, 21600);
    return response({ success: true, message: "Chunk diterima" });
  } catch (err) {
    return response({ success: false, message: "Chunk Error: " + err.toString() });
  }
}

function handleLogin(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = ss.getSheetByName('Users_Admin').getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.username && data[i][1] === payload.password) {
      writeLog(data[i][0], "LOGIN", "Admin masuk ke sistem");
      
      const token = "tok_" + Utilities.getUuid().replace(/-/g, "");
      const now = new Date().getTime();
      const expires = now + (6 * 60 * 60 * 1000); // 6 Jam
      
      const sessionSheet = getSessionsSheet();
      
      // Bersihkan sesi yang kadaluarsa untuk mencegah penumpukan baris
      try {
        const sessionData = sessionSheet.getDataRange().getValues();
        for (let j = sessionData.length - 1; j >= 1; j--) {
          const expVal = sessionData[j][2] ? sessionData[j][2].toString().trim() : "";
          const exp = Number(expVal) || 0;
          if (now > exp) {
            sessionSheet.deleteRow(j + 1);
          }
        }
      } catch (err) {}
      
      sessionSheet.appendRow([token, data[i][0], "'" + expires]);
      return response({ success: true, user: { username: data[i][0], role: data[i][2] }, token: token });
    }
  }
  return response({ success: false, message: 'Username atau password salah.' });
}

function maskPrivacy(str, type) {
  if (!str) return "";
  const s = str.toString();
  if (type === 'email') {
    const user = s.split("@");
    if (user.length !== 2) return s[0] + "****";
    return user[0][0] + "***@" + user[1];
  }
  if (type === 'phone') return s.substring(0, 4) + "****" + s.substring(s.length - 2);
  if (s.length <= 2) return s[0] + "*";
  return s[0] + "*".repeat(s.length - 2) + s[s.length - 1];
}

function generateNoReg() {
  const dateStr = Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd");
  return `TRON-${dateStr}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function sendTelegram(msg) {
  try {
    if (!CONFIG.TELEGRAM.TOKEN || CONFIG.TELEGRAM.TOKEN === 'PASTE_TOKEN_BOT_TELEGRAM_DISINI' || 
        !CONFIG.TELEGRAM.CHAT_ID || CONFIG.TELEGRAM.CHAT_ID === 'PASTE_CHAT_ID_ADMIN_DISINI') {
      return;
    }
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM.TOKEN}/sendMessage`;
    UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json', payload: JSON.stringify({ chat_id: CONFIG.TELEGRAM.CHAT_ID, text: msg, parse_mode: 'Markdown' }), muteHttpExceptions: true });
  } catch (e) {}
}

function handleDeleteGalleryItem(id, adminUser) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Gallery');
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        writeLog(adminUser, "DELETE_GALLERY", `ID: ${id}`);
        return response({ success: true });
      }
    }
    return response({ success: false, message: 'Data tidak ditemukan' });
  } catch (err) {
    return response({ success: false, message: 'Delete Gallery Error: ' + err.toString() });
  }
}

function response(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function safeParseDate(val) {
  if (!val) return null;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    return val;
  }
  const s = val.toString().trim();
  // Coba parse YYYY-MM-DD
  let match = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  // Coba parse DD/MM/YYYY atau DD-MM-YYYY
  match = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (match) {
    return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  }
  // Fallback
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  return null;
}

// --- GRUP KONTEN HANDLERS ---

function getOrCreateGroupsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Groups');
  if (!sheet) {
    sheet = ss.insertSheet('Groups');
    const headers = ["ID", "Nama", "Deskripsi", "Item_IDs", "Status"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#efefef');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function handleGetGroups() {
  const sheet = getOrCreateGroupsSheet();
  const data = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < data.length; i++) {
    result.push({
      id: data[i][0].toString(),
      nama: data[i][1],
      deskripsi: data[i][2],
      item_ids: data[i][3] ? data[i][3].toString().split('|') : [],
      status: data[i][4] || 'ACTIVE'
    });
  }
  return response({ success: true, data: result });
}

function handleCreateGroup(payload, adminUser) {
  const sheet = getOrCreateGroupsSheet();
  const id = "GRP-" + new Date().getTime();
  const rowData = [id, payload.nama, payload.deskripsi || '', '', 'ACTIVE'];
  sheet.appendRow(rowData);
  writeLog(adminUser, "CREATE_GROUP", `Grup Baru: ${payload.nama}`);
  return response({ success: true, data: { id: id, nama: payload.nama, deskripsi: payload.deskripsi, item_ids: [], status: 'ACTIVE' } });
}

function handleUpdateGroupItems(payload, adminUser) {
  const sheet = getOrCreateGroupsSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      const itemIdsStr = Array.isArray(payload.item_ids) ? payload.item_ids.join('|') : (payload.item_ids || '');
      sheet.getRange(i + 1, 4).setValue(itemIdsStr);
      writeLog(adminUser, "UPDATE_GROUP_ITEMS", `ID Grup: ${payload.id} (Total: ${payload.item_ids.length} item)`);
      return response({ success: true });
    }
  }
  return response({ success: false, message: 'Grup tidak ditemukan' });
}

function handleDeleteGroup(payload, adminUser) {
  const sheet = getOrCreateGroupsSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      sheet.deleteRow(i + 1);
      writeLog(adminUser, "DELETE_GROUP", `Hapus Grup ID: ${payload.id}`);
      return response({ success: true });
    }
  }
  return response({ success: false, message: 'Grup tidak ditemukan' });
}

// --- GOOGLE DRIVE LINK VALIDATOR HELPERS ---

function extractDriveFileId(url) {
  if (!url) return null;
  var m1 = url.match(/\/d\/([a-zA-Z0-9_-]{25,100})/);
  if (m1) return m1[1];
  var m2 = url.match(/[?&]id=([a-zA-Z0-9_-]{25,100})/);
  if (m2) return m2[1];
  return null;
}

function checkGoogleDriveLinkPublicAndDownloadable(url) {
  var fileId = extractDriveFileId(url);
  if (!fileId) {
    return { success: false, message: "Tautan tidak dikenali sebagai link Google Drive yang valid." };
  }

  try {
    var checkUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
    var maxRedirects = 5;
    var redirectsCount = 0;
    
    while (redirectsCount < maxRedirects) {
      var res = UrlFetchApp.fetch(checkUrl, {
        muteHttpExceptions: true,
        followRedirects: false
      });
      
      var code = res.getResponseCode();
      var headers = res.getHeaders();
      var location = headers["Location"] || headers["location"] || "";
      
      if (code === 200) {
        return { success: true, fileId: fileId };
      }
      
      if (code === 403) {
        return { success: false, message: "Akses ditolak (403). Pastikan file di Google Drive diatur ke 'Siapa saja yang memiliki link' (Anyone with link) dan pastikan opsi download TIDAK dibatasi/dinonaktifkan untuk viewer." };
      }
      
      if (code === 404) {
        return { success: false, message: "File tidak ditemukan (404) atau tidak dapat diakses secara publik." };
      }
      
      if (code === 301 || code === 302 || code === 303 || code === 307) {
        if (!location) {
          return { success: false, message: "Terjadi redirect tanpa lokasi tujuan yang valid." };
        }
        
        if (location.indexOf("accounts.google.com") !== -1) {
          return { success: false, message: "File Google Drive bersifat privat. Silakan ubah akses file menjadi 'Siapa saja yang memiliki link' (Anyone with the link) dan pastikan opsi download tidak dibatasi." };
        }
        
        checkUrl = location;
        if (checkUrl.indexOf("/") === 0) {
          checkUrl = "https://drive.google.com" + checkUrl;
        }
        redirectsCount++;
      } else {
        return { success: false, message: "Status server tidak dikenal: " + code };
      }
    }
    
    return { success: false, message: "Terlalu banyak pengalihan (redirect loop)." };
  } catch (e) {
    return { success: false, message: "Gagal memvalidasi link Google Drive: " + e.toString() };
  }
}

function validateAndGetDriveFileDetails(url) {
  var checkResult = checkGoogleDriveLinkPublicAndDownloadable(url);
  if (!checkResult.success) {
    return checkResult;
  }

  try {
    var file = DriveApp.getFileById(checkResult.fileId);
    var mimeType = file.getMimeType();
    return { success: true, fileId: checkResult.fileId, mimeType: mimeType };
  } catch (e) {
    return { success: false, message: "Gagal mendapatkan detail file dari DriveApp (pastikan file dapat diakses publik): " + e.toString() };
  }
}
