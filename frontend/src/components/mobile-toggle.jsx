import { Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTheme } from "../components/theme-provider";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={toggleTheme}
			className='relative overflow-hidden rounded-full'
			aria-label='Toggle theme'>
			<div className='relative h-[1.2rem] w-[1.2rem]'>
				<Sun
					className={`absolute h-full w-full transition-all duration-300 ${
						theme === "light"
							? "rotate-0 opacity-100"
							: "-rotate-90 opacity-0"
					}`}
				/>

				<Moon
					className={`absolute h-full w-full transition-all duration-300 ${
						theme === "dark"
							? "rotate-0 opacity-100"
							: "rotate-90 opacity-0"
					}`}
				/>
			</div>
		</Button>
	);
}
