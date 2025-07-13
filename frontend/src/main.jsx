import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { store, persistor } from "./app/store.js";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<PersistGate
				loading={null}
				persistor={persistor}>
				<ThemeProvider
					defaultTheme='light'
					storageKey='ecsb-theme'>
					<App />
					<Toaster
						position='top-right'
						
						richColors
					/>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	</StrictMode>,
);
