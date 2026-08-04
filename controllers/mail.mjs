import { Resend } from "resend";
const sendEmail = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { username, email, message, phoneNumber } = req.body;

  if (!username || !email) {
    return res
      .status(400)
      .json({ error: "Username, email, and address are required" });
  }

  try {
    // Send email using Resend API
    const response = await resend.emails.send({
      from: "SwiftHaulLogistics <onboarding@resend.dev>",
      to: "swiffthaullogistics@gmail.com",
      subject: `New request quotation from ${username}`,
      html: `
          <h1>New Quotation</h1>
          <p><strong>Name:</strong> ${username}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phonenumber:</strong> ${phoneNumber}</p>
           <p><strong>Message:</strong> ${message}</p>
        `,
    });

    console.log("Email sent successfully:", response);
    res.status(200).json({ message: "Email sent successfully", response });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
export { sendEmail };
