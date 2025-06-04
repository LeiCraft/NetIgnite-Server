
export class SessionStore {

    private static readonly userInfo = reactive<UserAuthInfo>({} as any);

    static useUserInfo() {
        return this.userInfo;
    }

    static setUserInfo(userInfo: UserAuthInfo) {
        for (const key in userInfo) {
            (this.userInfo as any)[key] = (userInfo as any)[key];
        }
    }

}
