
export class SessionStore {

    static useUserInfo() {
        const info = useState<UserAuthInfo>("userinfo").value as UserAuthInfo;
        if (!info) {
            navigateTo('/auth/login');
            return null as any as UserAuthInfo;
        }
        return info;
    }

    static setUserInfo(userInfo: UserAuthInfo) {
        useState<UserAuthInfo>("userinfo").value = userInfo;
    }

}
