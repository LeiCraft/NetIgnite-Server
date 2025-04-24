
export class EncodingUtils {
    static toHex(str: string) {
        return Array.from(new TextEncoder().encode(str))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    static fromHex(hex: string) {
        const bytes = new Uint8Array((hex.match(/.{1,2}/g) as any).map((b: any) => parseInt(b, 16)));
        return new TextDecoder().decode(bytes);
    }
}

