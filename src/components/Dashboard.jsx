import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Outlet, useLocation } from "react-router-dom";

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AddBoxSharp,
} from "@mui/icons-material";

const drawerWidth = 240;

// Sample content components for each menu item
export const DashboardContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    {/* <Typography variant="body1">Welcome to Transaction dashboard!</Typography> */}
  </Box>
);

export const UsersContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Users
    </Typography>
    <Typography variant="body1">
      Manage your users here. We can add, edit, or remove users.
    </Typography>
  </Box>
);

export const ReportsContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Reports
    </Typography>
    <Typography variant="body1">Analytics for subscriptions</Typography>
  </Box>
);

export const SettingsContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Settings
    </Typography>
    <Typography variant="body1">
      Add/Manage your Subscription settings and preferences.
    </Typography>
  </Box>
);

export default function Dashboard() {
  const location = useLocation();
  const role = location.pathname.split("/")[2];

  console.log(" is------------>", role); // merchant
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleProfileMenuClose();
    // Add your logout logic here
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    console.log("Signing out...");
    navigate("/login");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/home/dashboard",
      icon: <DashboardIcon />,
    },
    {
      id: "merchant",
      label: "Manage Merchant",
      path: "/home/merchant",
      icon: <PeopleIcon />,
    },
    {
      id: "subscription",
      label: "Subscription",
      path: "/home/subscription",
      icon: <AddBoxSharp />,
    },
    {
      id: "reports",
      label: "Reports",
      path: "/home/reports",
      icon: <BarChartIcon />,
    },
  ];

  // Drawer content
  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          My App
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname.startsWith(item.path)} // ✅ highlights active
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#27586f",
                  color: "#fff",
                  "& .MuiListItemIcon-root": {
                    color: "#fff", // ✅ icon turns white
                  },
                  "&:hover": {
                    backgroundColor: "#555d61",
                  },
                },
                "&:hover": {
                  backgroundColor: "#e8f2f5",
                },
                borderRadius: 1,
                mx: 1,
                width: "auto",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top AppBar */}

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#27586fff",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {role.toUpperCase()}
          </Typography>

          {/* Right side - Profile and Sign Out */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "#8AA624" }}>
                <PersonIcon />
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>

            {/* Alternative: Direct Sign Out Button */}
            {/* <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
            >
              Sign Out
            </Button> */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar - Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Left Sidebar - Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Space for AppBar
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* {renderContent()} */}
        <Outlet />
      </Box>
    </Box>
  );
}
