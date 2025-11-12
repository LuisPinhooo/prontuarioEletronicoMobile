import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/pages/Login';  // ← ADICIONAR
import Home from './src/pages/Home';
import Pacientes from './src/pages/Pacientes';
import CadastroPacientes from './src/pages/CadastroPacientes';
import Exames from './src/pages/Exames';
import CadastroExames from './src/pages/CadastroExames';
import Requisicoes from './src/pages/Requisicoes';
import CadastroRequisicoes from './src/pages/CadastroRequisicoes';
import LancamentoResultados from './src/pages/LancamentoResultados';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"  
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Login */}
        <Stack.Screen name="Login" component={Login} /> 
        
        <Stack.Screen name="Home" component={Home} />
        
        {/* Pacientes */}
        <Stack.Screen name="Pacientes" component={Pacientes} />
        <Stack.Screen name="CadastroPacientes" component={CadastroPacientes} />
        
        {/* Exames */}
        <Stack.Screen name="Exames" component={Exames} />
        <Stack.Screen name="CadastroExames" component={CadastroExames} />
        
        {/* Requisições */}
        <Stack.Screen name="Requisicoes" component={Requisicoes} />
        <Stack.Screen name="CadastroRequisicoes" component={CadastroRequisicoes} />
        
        {/* Lançamento de Resultados */}
        <Stack.Screen name="LancamentoResultados" component={LancamentoResultados} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}