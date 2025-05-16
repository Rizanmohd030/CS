const { getDB } = require('../config/db');

exports.getConstructionData = async (req, res) => {
  try {
    const db = req.db || getDB();
    const [employees, tasks] = await Promise.all([
      db.collection('employees').find().toArray(),
      db.collection('tasks').find().toArray()
    ]);
    
    res.json({ 
      success: true,
      employees,
      tasks,
      count: {
        employees: employees.length,
        tasks: tasks.length
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch construction data' 
    });
  }
};