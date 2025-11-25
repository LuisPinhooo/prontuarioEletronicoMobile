import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Login from "./src/pages/Login";
import Home from "./src/pages/Home";
import Sobre from "./src/pages/Sobre";
import Pacientes from "./src/pages/Pacientes";
import CadastroPacientes from "./src/pages/CadastroPacientes";
import Exames from "./src/pages/Exames";
import CadastroExames from "./src/pages/CadastroExames";
import Requisicoes from "./src/pages/Requisicoes";
import CadastroRequisicoes from "./src/pages/CadastroRequisicoes";
import Resultados from "./src/pages/Resultados";
import LancamentoResultados from "./src/pages/LancamentoResultados";
import ListaResultados from "./src/pages/ListaResultados";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Home Stack (com todos os menus internos)
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="Pacientes" component={Pacientes} />
      <Stack.Screen name="CadastroPacientes" component={CadastroPacientes} />
      <Stack.Screen name="Exames" component={Exames} />
      <Stack.Screen name="CadastroExames" component={CadastroExames} />
      <Stack.Screen name="Requisicoes" component={Requisicoes} />
      <Stack.Screen name="CadastroRequisicoes" component={CadastroRequisicoes} />
      <Stack.Screen name="Resultados" component={Resultados} />
      <Stack.Screen name="ListaResultados" component={ListaResultados} />
      <Stack.Screen name="LancamentoResultados" component={LancamentoResultados} />
    </Stack.Navigator>
  );
}

// Drawer com Home e Sobre
function HomeDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#007bff",
        drawerInactiveTintColor: "#666",
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeStack}
        options={{
          drawerLabel: "Retornar",
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>↩️</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Sobre"
        component={Sobre}
        options={{
          drawerLabel: "Sobre o Projeto",
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>ℹ️</Text>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// App principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
