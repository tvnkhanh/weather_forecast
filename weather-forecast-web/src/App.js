import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Link,
  SvgIcon,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Avatar,
  Paper,
  MenuItem,
} from "@mui/material";
import UserServices from "./api/UserServices";
import Search from "./components/Search/Seach";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import TodayWeather from "./components/TodayWeather/TodayWeather";
import { fetchWeatherData } from "./api/OpenWeatherService";
import { transformDateFormat } from "./utilities/DatetimeUtils";
import UTCDatetime from "./components/Reusable/UTCDatetime";
import LoadingBox from "./components/Reusable/LoadingBox";
import { ReactComponent as SplashIcon } from "./assets/splash-icon.svg";
import Logo from "./assets/logo.png";
import ErrorBox from "./components/Reusable/ErrorBox";
import { ALL_DESCRIPTIONS } from "./utilities/DateConstants";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from "./utilities/DataUtils";

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openDropDownMenu, setOpenDropDownMenu] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const isValid = await UserServices.tokenIsValid(storedToken);
          if (isValid) {
            setToken(storedToken);
            const userData = await UserServices.getCurrentUser(storedToken);
            setUser(userData);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Token validation failed:", error);
        }
      }
    };
    checkTokenValidity();
  }, []);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(" ");

    setIsLoading(true);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);
      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  const handleAvatarClick = () => {
    setOpenDropDownMenu(!openDropDownMenu);
  };

  const handleLoginOpen = () => setOpenLoginDialog(true);
  const handleLoginClose = () => {
    setOpenLoginDialog(false);
    setLoginError(""); // Reset login error
  };
  const handleRegisterOpen = () => setOpenRegisterDialog(true);
  const handleRegisterClose = () => {
    setOpenRegisterDialog(false);
    setRegisterError(""); // Reset register error
  };
  const switchToRegister = () => {
    setOpenLoginDialog(false);
    setLoginError(""); // Reset login error
    setOpenRegisterDialog(true);
  };
  const switchToLogin = () => {
    setOpenRegisterDialog(false);
    setRegisterError(""); // Reset register error
    setOpenLoginDialog(true);
  };

  const handleLogin = async () => {
    try {
      const data = await UserServices.signin(loginEmail, loginPassword);
      setToken(data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      if (rememberMe) {
        localStorage.setItem("token", data.token);
      }
      handleLoginClose();
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError(error.message || "Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      const data = await UserServices.signup(
        registerName,
        registerEmail,
        registerPassword
      );
      setToken(data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      handleRegisterClose();
    } catch (error) {
      console.error("Registration failed:", error);
      setRegisterError(error.message || "Registration failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        minHeight: "500px",
      }}
    >
      <SvgIcon
        component={SplashIcon}
        inheritViewBox
        sx={{ fontSize: { xs: "100px", sm: "120px", md: "140px" } }}
      />
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: "12px", sm: "14px" },
          color: "rgba(255,255,255, .85)",
          fontFamily: "Poppins",
          textAlign: "center",
          margin: "2rem 0",
          maxWidth: "80%",
          lineHeight: "22px",
        }}
      >
        Explore current weather data and 6-day forecast of more than 200,000
        cities!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "500px",
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              color: "rgba(255, 255, 255, .8)",
              lineHeight: 1,
              fontFamily: "Poppins",
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: { xs: "95%", sm: "80%", md: "1100px" },
        width: "100%",
        height: "100%",
        margin: "0 auto",
        padding: "1rem 0 3rem",
        marginBottom: "1rem",
        borderRadius: {
          xs: "none",
          sm: "0 0 1rem 1rem",
        },
        boxShadow: {
          xs: "none",
          sm: "rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px",
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: "16px", sm: "22px", md: "26px" },
                width: "auto",
              }}
              alt="logo"
              src={Logo}
            />
            <UTCDatetime />
            {isLoggedIn ? (
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt={user?.name}
                  src={user?.avatarUrl}
                  sx={{ width: 32, height: 32, cursor: "pointer" }}
                  onClick={handleAvatarClick}
                />
                {openDropDownMenu && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      zIndex: 1,
                      minWidth: 200,
                    }}
                  >
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="body1">
                        Hello, {user?.name}
                      </Typography>
                      <MenuItem>
                        <IconButton
                          color="primary"
                          aria-label="Favorite Cities"
                        >
                          <FavoriteIcon />
                        </IconButton>
                        Favorite Cities
                      </MenuItem>
                      <MenuItem>
                        <IconButton color="primary" aria-label="About">
                          <InfoIcon />
                        </IconButton>
                        About
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <IconButton color="primary" aria-label="Logout">
                          <ExitToAppIcon />
                        </IconButton>
                        Logout
                      </MenuItem>
                    </Paper>
                  </Box>
                )}
              </Box>
            ) : (
              <Button
                onClick={handleLoginOpen}
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            )}
          </Box>
          <Search onSearchChange={searchChangeHandler} />
        </Grid>
        {appContent}
      </Grid>

      <Dialog open={openLoginDialog} onClose={handleLoginClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          {loginError && <Typography color="error">{loginError}</Typography>}{" "}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
        <DialogActions>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link component="button" variant="body2" onClick={switchToRegister}>
              Sign up now
            </Link>
          </Typography>
        </DialogActions>
      </Dialog>

      <Dialog open={openRegisterDialog} onClose={handleRegisterClose}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
          />
          {registerError && (
            <Typography color="error">{registerError}</Typography>
          )}{" "}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRegister} color="primary">
            Register
          </Button>
        </DialogActions>
        <DialogActions>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component="button" variant="body2" onClick={switchToLogin}>
              Login here
            </Link>
          </Typography>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
