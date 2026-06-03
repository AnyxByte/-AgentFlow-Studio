import Task from "../models/task.js";
import User from "../models/user.js";

const normalizeAndValidateRows = (parsedRows) => {
  const validatedTasks = [];

  parsedRows.forEach((row, index) => {
    const firstName = row.FirstName || row.firstname || row["First Name"];
    const phoneStr = row.Phone || row.phone || row["Phone Number"];
    const notes = row.Notes || row.notes || "";

    const cleanPhone = Number(phoneStr);

    if (!firstName || isNaN(cleanPhone)) {
      console.log(`Row ${index + 1} rejected: Invalid formatting.`);
      return;
    }

    validatedTasks.push({
      firstName: String(firstName).trim(),
      phone: cleanPhone,
      notes: String(notes).trim(),
    });
  });

  if (validatedTasks.length === 0) {
    throw new Error(
      "Validation failure: No valid data rows matched criteria specs.",
    );
  }

  return validatedTasks;
};

const allocateTasksRoundRobin = (validatedTasks, agents) => {
  const totalAgents = agents.length;

  return validatedTasks.map((task, index) => {
    const assignedAgentIndex = index % totalAgents;
    return {
      ...task,
      assignedTo: agents[assignedAgentIndex]._id,
    };
  });
};

const generateDistributionSummary = (agents, insertedTasks) => {
  return agents.map((agent) => {
    const assignedCount = insertedTasks.filter(
      (task) => task.assignedTo.toString() === agent._id.toString(),
    ).length;

    return {
      agentId: agent._id,
      agentName: agent.name,
      allocatedCount: assignedCount,
    };
  });
};

const compileAgentTaskMatrix = async (agents) => {
  return await Promise.all(
    agents.map(async (agent) => {
      const tasks = await Task.find({ assignedTo: agent._id })
        .select("firstName phone notes createdAt")
        .sort({ createdAt: -1 });

      return {
        agentId: agent._id,
        agentName: agent.name,
        agentEmail: agent.email,
        agentMobile: agent.mobileNumber,
        taskCount: tasks.length,
        tasks: tasks,
      };
    }),
  );
};

export const uploadAndDistributeTasksController = async (req, res) => {
  try {
    const { parsedRows } = req.body;

    if (!parsedRows || !Array.isArray(parsedRows) || parsedRows.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Payload parameters should contain a non-empty parsedRows array.",
      });
    }

    const agents = await User.find({ role: "agent" })
      .sort({ createdAt: 1 })
      .limit(5);
    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active agents found. Please upload agents first.",
      });
    }

    const validatedTasks = normalizeAndValidateRows(parsedRows);
    const finalTasksToInsert = allocateTasksRoundRobin(validatedTasks, agents);
    const insertedTasks = await Task.insertMany(finalTasksToInsert);
    const distributionSummary = generateDistributionSummary(
      agents,
      insertedTasks,
    );

    return res.status(200).json({
      success: true,
      message: "Saved successfully.",
      data: {
        totalProcessed: insertedTasks.length,
        agentsCount: agents.length,
        summary: distributionSummary,
      },
    });
  } catch (error) {
    console.error("Task distribution failure:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getDistributedTasksController = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" })
      .select("-password")
      .sort({ createdAt: 1 });

    const distributedDataMatrix = await compileAgentTaskMatrix(agents);

    return res.status(200).json({
      success: true,
      data: distributedDataMatrix,
    });
  } catch (error) {
    console.error("Fetch Allocation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
