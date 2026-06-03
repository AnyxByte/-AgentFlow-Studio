import User from "../models/user.js";

export const createAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    if (!name || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (Name, Email, Mobile with country code, Password) are required.",
      });
    }

    const agentExists = await User.findOne({ email });
    if (agentExists) {
      return res.status(400).json({
        success: false,
        message:
          "An account context matching that email parameter already exists.",
      });
    }

    const newAgent = await User.create({
      name,
      email,
      mobileNumber,
      password,
      role: "agent",
    });

    return res.status(201).json({
      success: true,
      message: "Agent record initialized successfully.",
      agent: {
        id: newAgent._id,
        name: newAgent.name,
        email: newAgent.email,
        mobileNumber: newAgent.mobileNumber,
        role: newAgent.role,
      },
    });
  } catch (error) {
    console.error("Agent Provisioning Exception:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server processing error.",
    });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    console.error("Fetch Agents Matrix Exception:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server processing error.",
    });
  }
};
