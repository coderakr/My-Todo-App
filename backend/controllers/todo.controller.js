import Todo from "../models/todo.models.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      title,
      description,
      userId: req.userId, // comes from auth middleware
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, userId: req.userId });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.title = req.body.title ?? todo.title;
    todo.description = req.body.description ?? todo.description;
    todo.completed = req.body.completed ?? todo.completed;

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleTodoCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.status(200).json(todo);
  } catch (error) {
    console.error("Toggle todo error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
