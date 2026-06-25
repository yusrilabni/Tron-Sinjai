## Definitive File Upload Architecture (100MB Limit)

To bypass Google Apps Script's 50MB payload limit (for single posts) and 30-second execution timeout, a **Three-Phase Async Process** MUST be used:

1.  **Phase 1: Chunking (Frontend)**:
    -   Split files into small chunks of **70KB** (safe limit for GAS `CacheService`).
    -   Upload chunks sequentially to `uploadChunk` action.
    -   Status: `uploadProgress` moves from 0% to 100%.

2.  **Phase 2: Assembly (Server - Request 1)**:
    -   Triggered by `assembleChunkFile` after all chunks are sent.
    -   **Crucial Rule**: The backend MUST assemble chunks into a **plain JavaScript Array of bytes**.
    -   **DO NOT USE** `Int8Array`, `Uint8Array`, or `.buffer` when calling `Utilities.newBlob()`. GAS legacy engine requires standard Java-style byte arrays.
    -   Assembly returns the permanent Drive URL.

3.  **Phase 3: Recording (Server - Request 2)**:
    -   Submit form metadata along with the permanent Drive URL to `submitPengajuan`.
    -   This ensures the Spreadsheet entry and Drive file are always synchronized.

## Lessons Learned & Regressions to Avoid

-   **Blank Page (Fatal Crash)**: Always ensure all exported members in `src/api/index.ts` are present. Removing a single exported function used by a component will crash the entire Vue app.
-   **Invalid End Tag (Syntax Error)**: Avoid multiple `replace` calls on the same file in a single turn. Use `write_file` for complex structural changes to ensure a clean state.
-   **Network Error (Timeout)**: Large file operations (like merging 500 chunks) MUST have separate API calls and an Axios timeout of at least **120 seconds**.
-   **GAS Parameter Mismatch**: `Utilities.newBlob()` first argument MUST be a standard Array. Example: `let combined = []; chunks.forEach(c => combined.push(...c));`.

## Core Directives

1.  **Comprehensive Code Review**: For every task or instruction provided by the user, the agent MUST perform a thorough check of all affected code files. This includes verifying imports, exports, logic flow, and structural integrity.
2.  **Surgical Fixes**: Every change must be applied precisely to fix identified issues without introducing regressions or corrupting file structures (e.g., duplicated script tags).
3.  **Proactive Validation**: Before declaring a task complete, the agent must ensure that all logic (including error handling and edge cases) is sound and follows the established architectural patterns.
4.  **Automatic Continuity**: The agent must maintain state across turns, ensuring that fixes in one file (e.g., backend) are reflected in the corresponding frontend logic.
5.  **Automatic Git Synchronization**: Whenever the agent modifies or creates any codebase files, the agent **MUST** automatically run `git add .`, `git commit -m "[Deskripsi Perubahan]"` and `git push` to synchronize changes with the remote Git repository immediately without manual user intervention.



## Technical Constraints

-   **Backend (Google Apps Script)**:
    -   Payload Limit: 50MB hard limit for `doPost`.
    -   CacheService Limit: 100KB per key.
    -   Timeout Limit: 30 seconds for synchronous execution.
    -   File Naming: Files uploaded to Drive MUST follow the format `REG_[Judul]_[UniqueID]_[Timestamp]`.
-   **Artisan Commands**:
    -   **NEVER** run `php artisan optimize:clear`, `php artisan optimize`, or `php artisan view:clear`. The user has explicitly forbidden these commands.

## Operational Workflows

-   **Chunked Uploads**: Large files (>15MB) MUST be uploaded in small chunks (~70KB) to bypass GAS limits. The assembly of these chunks MUST be triggered by the final form submission to ensure the spreadsheet entry and file creation are synchronized.
-   **Autofill Prevention**: Text inputs like "Judul" that are prone to incorrect browser password suggestions MUST use `autocomplete="new-password"` and unique `name` attributes, along with hidden fake inputs to trap browser heuristics.

## Automated CLASP Deployments

-   **Automatic Synchronization**: Whenever the agent modifies the backend file `google-apps-script.js`, the agent **MUST** automatically run `clasp push` followed by `clasp deploy -i AKfycbz2xMjXWGVa-KUQX19P5FmJASFwfzWlV88YkhPaKvKwYkC5esf12EOZYuZtd9tLWZllpA -d "Automated deployment from Clasp CLI"` to apply the changes to the live system immediately without manual user intervention.

