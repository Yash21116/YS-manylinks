/* config.js — Admin secret configuration
 *
 * Set ADMIN_SECRET_HASH to the SHA-256 hash of your secret.
 *
 * To generate your hash, run this in the browser console (F12):
 *
 *   (async () => {
 *     const hash = await crypto.subtle.digest(
 *       'SHA-256', new TextEncoder().encode('your-secret-here'));
 *     console.log(Array.from(new Uint8Array(hash))
 *       .map(b => b.toString(16).padStart(2, '0')).join(''));
 *   })();
 *
 * Copy the 64-character result and paste it below.
 */

window.ADMIN_SECRET_HASH = ''; // ← paste your SHA-256 hash here
