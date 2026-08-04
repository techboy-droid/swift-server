import Logistic from "../models/logistic.mjs";
import mongoose from "mongoose";
const createLogisticController = async (req, res) => {
  try {
    const logistic = new Logistic(req.body);
    await logistic.save();
    res.status(201).json(logistic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateLogisticController = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No logistic with id: ${id}`);
  const updatedLogistic = await Logistic.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedLogistic) {
    return res.status(404).json({ message: "Logistic not found" });
  }

  res.status(200).json(updatedLogistic);
  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLogistic = async (req, res) => {
  try {
    const { id } = req.params;
    const logistic = await Logistic.findByIdAndDelete(id);

    if (!deleteLogistic) {
      return res.status(404).json({ message: "Logistic not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Logistic Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getLogistic = async (req, res) => {
  try {
    const { id } = req.params;
    const logistic = await Logistic.findOne({
      trackingNumber: id,
    });

    if (!logistic) {
      return res.status(404).json({ message: "Logistic not found" });
    }

    res.status(200).json({ success: true, data: logistic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLogistics = async (req, res) => {
  try {
    const Logistics = await Logistic.find();
    res.status(200).json(Logistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEventsController = async (req, res) => {
  const { id } = req.params;

  const currentLogistic = await Logistic.findById(id);
  if (!currentLogistic)
    return res.status(404).send(`No logistic with id: ${id}`);
  // const updatedEvents = [...currentLogistic.events, ...req.body];
  const updatedLogistic = await Logistic.findByIdAndUpdate(
    id,
    {
      events: req.body,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedLogistic,
  });
  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteEventsController = async (req, res) => {
  const { id } = req.params;
  const { index } = req.body;

  const currentLogistic = await Logistic.findById(id);
  if (!currentLogistic) {
    console.log("not found");
    return res.status(404).send(`No logistic with id: ${id}`);
  }
  const updatedEvents = currentLogistic.events.filter((_, i) => i !== index);
  const updatedLogistic = await Logistic.findByIdAndUpdate(
    id,
    {
      events: updatedEvents,
    },
    {
      new: true,
    }
  );

  res.status(200).json(updatedLogistic);
  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const logistics = await Logistic.find()
      .select("status totalCharges createdAt")
      .lean();

    const norm = (s) => (s || "").trim().toLowerCase();
    const parseAmount = (value) => {
      const amount = parseFloat(String(value || "").replace(/[^0-9.-]/g, ""));
      return isNaN(amount) ? 0 : amount;
    };

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let pendingShipments = 0;
    let inTransitShipments = 0;
    let completedShipments = 0;
    let todaysRevenue = 0;
    let totalRevenue = 0;

    for (const logistic of logistics) {
      const status = norm(logistic.status);
      if (status === "delivered") completedShipments++;
      else if (status === "in transit") inTransitShipments++;
      else pendingShipments++;

      const amount = parseAmount(logistic.totalCharges);
      totalRevenue += amount;
      if (logistic.createdAt && logistic.createdAt >= startOfToday) {
        todaysRevenue += amount;
      }
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyShipments = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(startOfToday);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      weeklyShipments.push({
        day: dayNames[dayStart.getDay()],
        date: dayStart.toISOString().slice(0, 10),
        count: logistics.filter(
          (l) => l.createdAt && l.createdAt >= dayStart && l.createdAt < dayEnd
        ).length,
      });
    }

    const totalShipments = logistics.length;
    const pct = (n) =>
      totalShipments ? Math.round((n / totalShipments) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalShipments,
        pendingShipments,
        inTransitShipments,
        completedShipments,
        todaysRevenue,
        totalRevenue,
        weeklyShipments,
        deliveryStats: {
          delivered: pct(completedShipments),
          inTransit: pct(inTransitShipments),
          pending: pct(pendingShipments),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createLogisticController,
  updateLogisticController,
  deleteLogistic,
  getAllLogistics,
  getLogistic,
  updateEventsController,
  deleteEventsController,
  getDashboardStats,
};
