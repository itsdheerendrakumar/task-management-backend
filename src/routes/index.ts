import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import taskRoutes from "../modules/task/task.routes.js";
import activityRoutes from "../modules/activity/activity.routes.js";
import messageRoutes from "../modules/message/message.routes.js";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/task",
    route: taskRoutes,
  },
  {
    path: "/activity",
    route: activityRoutes,
  },
  {
    path: "/message",
    route: messageRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;