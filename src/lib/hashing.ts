/**
 * Hash a string using SHA-256.
 *
 * Returns a hexadecimal SHA-256 hash.
 *
 * Example:
 *
 * input:
 * john@example.com
 *
 * output:
 * a94a8fe5ccb19ba...
 */
export async function hashSHA256(value?: string): Promise<string | undefined> {
  if (!value) {
    return undefined;
  }

  const encoder = new TextEncoder();

  const data = encoder.encode(value);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
