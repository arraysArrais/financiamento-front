//import './App.css'
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import { MantineColorsTuple, MantineProvider, createTheme } from '@mantine/core';
import { MainRoutes } from './routes/MainRoutes';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
const myColor: MantineColorsTuple = [
  '#f3edff',
  '#e0d7fa',
  '#beabf0',
  '#9a7ce6',
  '#7c56de',
  '#683dd9',
  '#5f2fd8',
  '#4f23c0',
  '#451eac',
  '#3a1899'
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: 'indigo',
  breakpoints: {
    xs: '500',
    sm: '800',
    md: '1000',
    lg: '1200',
    xl: '1400',
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <Notifications />
        <MainRoutes />
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
