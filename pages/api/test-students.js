import db from "../../utils/db";
import Student from "../../models/Student";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await db.connectDb();
      
      // Test basic connection
      const totalStudents = await Student.countDocuments({});
      const activeStudents = await Student.countDocuments({
        status: { $in: ["Đang học", "Tạm nghỉ"] }
      });
      
      // Get some sample students
      const sampleStudents = await Student.find({}).limit(5).select('studentId fullName status course class');
      
      res.status(200).json({
        success: true,
        data: {
          totalStudents,
          activeStudents,
          sampleStudents,
          message: "Student API test successful"
        }
      });
    } catch (error) {
      console.error("Test API error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Student API test failed"
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
