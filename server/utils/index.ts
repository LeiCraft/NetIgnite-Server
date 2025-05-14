import { randomBytes } from 'crypto';

export class Utils {

    static getRandomU32() {

        const timeComponent = Date.now() % 0x100000000;
        const randomComponent = randomBytes(4).readUInt32BE(0);

        return (timeComponent + randomComponent) % 0x100000000;
    }

    static splitNTimes(str: string, delim: string, count: number) {
        const parts = str.split(delim);
        const tail = parts.slice(count).join(delim);
        const result = parts.slice(0,count);
        if (tail) result.push(tail);
        return result;
    }

}
