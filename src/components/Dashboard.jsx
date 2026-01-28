// Dashboard.jsx - Complete Dashboard with Top Navbar and Sidebar
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/icons-material";

const drawerWidth = 240;

// Sample content components for each menu item
const DashboardContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <Typography variant="body1">Welcome to Transaction dashboard!</Typography>
  </Box>
);

const UsersContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Users
    </Typography>
    <Typography variant="body1">
      Manage your users here. We can add, edit, or remove users.
    </Typography>
  </Box>
);

const ReportsContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Reports
    </Typography>
    <Typography variant="body1">
      View and generate reports for your application.
    </Typography>
  </Box>
);

const SettingsContent = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Settings
    </Typography>
    <Typography variant="body1">
      Configure your application settings and preferences.
    </Typography>
  </Box>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (menuItem) => {
    setSelectedMenu(menuItem);
    setMobileOpen(false); // Close drawer on mobile after selection
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
    console.log("Signing out...");
    navigate("/login");
  };

  // Menu items configuration
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "users", label: "Users", icon: <PeopleIcon /> },
    { id: "reports", label: "Reports", icon: <BarChartIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UsersContent />;
      case "reports":
        return <ReportsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

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
              selected={selectedMenu === item.id}
              onClick={() => handleMenuClick(item.id)}
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
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
            Dashboard
          </Typography>

          {/* Right side - Profile and Sign Out */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
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
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
