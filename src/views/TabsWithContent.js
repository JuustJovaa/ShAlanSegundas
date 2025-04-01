import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import ListadoAlumnos from "./ListadoAlumnos";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BallotIcon from "@mui/icons-material/Ballot";

const MainContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minHeight: "80vh",
  position: "relative",
  backgroundColor: "#f0f0f0",
  width: "100%",
});

const ContentContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(2), 
  width: "100%",
  maxWidth: "1440px",
  margin: "0 auto",
  minHeight: "90vh",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
}));

const StyledTabsContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
  boxShadow: theme.shadows[6],
  backgroundColor: theme.palette.background.paper,
}));

const TabsWithContent = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainContainer>
      <ContentContainer>
        {value === 0 && (
          <Box
            sx={{
              width: "100%",
              p: isSmallScreen ? 0 : 2,
              mt: isSmallScreen ? 0 : 4,
            }}
          >
            <ListadoAlumnos />
          </Box>
        )}

        {value === 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "90vh",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
              p: isSmallScreen ? 0 : 3,
              mt: isSmallScreen ? 3 : 6,
            }}
          >
            <Typography
            gutterBottom
              variant={isSmallScreen ? "h6" : "h5"}
              sx={{ fontWeight: "bold", textAlign: "center", mr: isSmallScreen ? 4 : 0, }}
            >
              Hasta pronto!
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              startIcon={<PersonPinIcon />}
              size={isSmallScreen ? "small" : "large"}
              disabled={isSubmitting}
              sx={{
                width: { xs: "60%", sm: "auto" },
                px: isSmallScreen ? 2 : 4,
                py: 1,
                mr: isSmallScreen ? 4 : 2,
              }}
            >
              {isSmallScreen ? "Salir" : "Cerrar Sesión"}
            </Button>
          </Box>
        )}
      </ContentContainer>

      <StyledTabsContainer>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              top: 0,
              height: 3,
            },
            "& .MuiTab-root": {
              minHeight: 64,
              [theme.breakpoints.down("sm")]: {
                minHeight: 56,
                fontSize: "0.75rem",
              },
            },
          }}
        >
          <Tab
            icon={<BallotIcon fontSize={isSmallScreen ? "small" : "medium"} />}
            label="Listado"
            iconPosition="start"
            sx={{
              "& svg": {
                marginRight: isSmallScreen
                  ? theme.spacing(0.5)
                  : theme.spacing(1),
              },
            }}
          />
          <Tab
            icon={
              <PersonPinIcon fontSize={isSmallScreen ? "small" : "medium"} />
            }
            label="Usuario"
            iconPosition="start"
            sx={{
              "& svg": {
                marginRight: isSmallScreen
                  ? theme.spacing(0.5)
                  : theme.spacing(1),
              },
            }}
          />
        </Tabs>
      </StyledTabsContainer>
    </MainContainer>
  );
};

export default TabsWithContent;
