import jwt from "jsonwebtoken"

const authAdmin = async (req, res, next) => {
    try {
        const {atoken}=req.headers;
        if (!atoken) {
            return res.json({ success: false, message: "Not authorized login" });
        }
        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
        if(decoded!==process.env.ADMIN_EMAIL + process.env.ADMIN_PASS){
            return res.json({success:false,message:"invalid creditional"})

        }
        else{
            
            next();
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authAdmin;