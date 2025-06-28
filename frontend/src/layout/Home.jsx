import { useCheckAuthQuery } from "../services/auth.js";

const Home = () => {
	const { data, error, isError } = useCheckAuthQuery();

	if (error?.error) {
		return (
			<div className='h-full flex justify-center items-center'>
				<p>{error?.status} : Please Check Your Internet</p>
			</div>
		);
	}
	if (error?.data) {
		return (
			<div className='h-full flex justify-center items-center'>
				<p>{error?.data?.message}</p>
			</div>
		);
	}
	return <div>Home</div>;
};

export default Home;
