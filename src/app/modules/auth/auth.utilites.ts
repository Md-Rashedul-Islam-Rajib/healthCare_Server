import  jwt  from 'jsonwebtoken';
export const createToken = (payload: any, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload!, secret, { algorithm: "HS512", expiresIn });
    return token;
}