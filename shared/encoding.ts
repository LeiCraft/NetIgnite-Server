
export class EncodingUtils {
    static toHex(str: string, bin = false) {
        const uint8array = new TextEncoder().encode(str)
        if (bin) return uint8array;
        return Array.from(uint8array).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static async fromHex(buf: Uint8Array | ArrayBuffer | Blob): Promise<string> {

        if (buf instanceof Blob) {
            const arrayBuffer = await buf.arrayBuffer();
            return this.fromHex(arrayBuffer);
        }

        return new TextDecoder().decode(new Uint8Array(buf));
    }
}

