import dbConnect from "@/lib/db/dbConnect";
import User from "@/lib/db/models/User";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import EmailTemplate from "@/components/Email/EmailTemplate";
import sendMail from "@/lib/utils/sendMail";

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = async () => {
  const otp = Math.floor(10000 + Math.random() * 90000);
  const currentTime = Date.now();
  const expiryTime = currentTime + 120000;
  const hashedOTP = await bcrypt.hash(otp.toString(), 10);
  return { otp, hashedOTP, expiryTime };
};


// SIGNIN USER
export async function POST(req, res) {
  const { email } = await req.json();
  await dbConnect();
  try {
    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
      });
    }
    let query = {
      email: email,
    };

    const user = await User.findOne(query);

    if (!user) {
      console.log("Email does not exist");
      return new Response(JSON.stringify({ message: "Email does not exist" }), {
        status: 400,
      });
    }
    const { otp, hashedOTP, expiryTime } = await generateOTP();
    user.otp = hashedOTP;
    user.otpExpiry = expiryTime;
    await user.save();

    const otpDigits = otp.toString().split("").map(Number);
    await sendMail(email, otpDigits);
    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return new Response(
      JSON.stringify({ error: error.message, message: "Error in sign-in" }),
      { status: 500 }
    );
  }
}
