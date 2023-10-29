import mongoose from "mongoose";
import validator from "validator";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!(validator.isEmail(value))){
                throw new Error("Email not valid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:8
    },
    tc:{
        type:Boolean,
        required:true
    }
})

const userModel=new mongoose.model('userdb', userSchema);

export default userModel;