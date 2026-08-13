import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const DEFAULT_JWT_SECRET = "default_secret_key";

const AuthUser = async (req) => {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) return false;

    try {
        const jwtSecret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

        const extractAuthUserInfo = jwt.verify(token, jwtSecret);
        if (extractAuthUserInfo) return extractAuthUserInfo;
    } catch (e) {
        console.log(e);
        return false;
    }

    return false;
};

export default AuthUser;