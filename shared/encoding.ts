
export class EncodingUtils {
    static toHex(str: string) {
        return Array.from(new TextEncoder().encode(str))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    static async fromHex(buf: Uint8Array | ArrayBuffer | Blob): Promise<string> {

        if (buf instanceof Blob) {
            const arrayBuffer = await buf.arrayBuffer();
            return this.fromHex(arrayBuffer);
        }

        return new TextDecoder().decode(new Uint8Array(buf));
    }
}

