import mongoose, { Model, HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface IUser {
    email: string,
    name: string,
    password: string,
    tokens: {token: string}[]
}

interface IUserMethods {
    generateAuthToken(): Promise<string>;
    toJSON(): {
        email: string,
        name: string
    };
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
    findByCredentials(email: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        reqiured: true,
        minLength: 7,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
    // dateOfBirth: {
    //     type: Date,
    // }
})

UserSchema.statics.findByCredentials = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        console.log("user not found with email: ", email, " and password: ", password);
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        console.log("password doesn't match for email: ", email, " and password: ", password);
        throw new Error('Unable to login');
    }

    return user;
}

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, String(process.env.JWT_SECRET));

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

UserSchema.methods.toJSON = function () {
    const user = this;
    const { email, name } = user.toObject()
    return { email, name };
}

UserSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
})

const User = mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;