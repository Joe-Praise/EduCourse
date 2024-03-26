import { FC, Fragment } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import angleIcon from '../../assets/icon/chevron-down.svg';
import avi from '../../assets/image/Ellipse 1.jpg';
import { linkType } from './navigationType';
import useHandleModal from '../../hooks/UseHandleModal';
import HamburgerBtn from '../../components/shared/HamburgerBtn';
import Logo from '../../components/shared/Logo';
import { getLocalStorage } from '../../util/helperFunctions/helper';
import config from '../../../config';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { logoutAction } from '../../redux/actions/authAction';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';

const LayoutHeader: FC = () => {
	const userDetails = getLocalStorage('profile')?.user;
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();
	// const userData = useSelector((state: RootState) => state.auth);
	// console.log(userData);

	// takes out an element from an array
	const takeOut = (arr: linkType[], id: number) => {
		return arr.filter((el) => el.id !== id);
	};

	const {
		modal: toggleDropdown,
		handleModal: handleToggleDropdown,
		// closeModal: closeDropdown,
	} = useHandleModal();

	const { modal: HamburgerState, handleModal: handleToggleHamburger } =
		useHandleModal();

	const leftLinks: linkType[] = [
		{
			id: 1,
			name: 'Home',
			path: '/',
		},
		{
			id: 2,
			name: 'Courses',
			path: '/courses',
		},
		{
			id: 3,
			name: 'Blog',
			path: '/blogs',
		},
		{
			id: 4,
			name: 'My learning',
			path: '/my-courses/learning',
		},
		{
			id: 5,
			name: "FAQ's",
			path: '/faqs',
		},
	];

	const rightLinks: linkType[] = [
		{
			id: 1,
			name: 'Login',
			path: '/signin',
			// onClick: ''
		},
		{
			id: 2,
			name: 'Sign Up',
			path: '/signup',
		},
	];

	const dropdown: linkType[] = [
		{
			id: 1,
			name: 'Profile',
			path: '/profile',
		},
		{
			id: 2,
			name: 'Contact Us',
			path: '/contactus',
		},
		{
			id: 3,
			name: 'Logout',
			path: '/logout',
		},
	];

	const mobileNav: linkType[] = [
		{
			id: 1,
			name: 'Home',
			path: '/',
		},
		{
			id: 2,
			name: 'Courses',
			path: '/courses',
		},
		{
			id: 3,
			name: 'Blog',
			path: '/blogs',
		},
		{
			id: 4,
			name: 'My learning',
			path: '/my-courses/learning',
		},
		{
			id: 5,
			name: "FAQ's",
			path: '/faqs',
		},
		{
			id: 6,
			name: 'Profile',
			path: '/profile',
		},
		{
			id: 7,
			name: 'Contact Us',
			path: '/contactus',
		},
	];

	// takes out the fourth element from the leftLinks array(my learning)
	const loopFrom = userDetails ? leftLinks : takeOut(leftLinks, 4);
	const loopFromMobile = userDetails ? leftLinks : takeOut(mobileNav, 4);

	const handleLogoutFunctionality = () => {
		dispatch(logoutAction(navigate));
	};

	/**
	 *
	 * @returns UI based on the login status i.e bottom profile btn when user is logged in and login & sign up when not logged in
	 */
	const handleMobileDisplayProfileBtn = () => {
		if (!userDetails) {
			return (
				<>
					{rightLinks?.map((el) => (
						<li
							key={el.id}
							className='hover:underline hover:underline-offset-4  uppercase'
						>
							<NavLink
								to={el.path}
								className={({ isActive }) =>
									isActive
										? 'block p-2 underline underline-offset-4 text-[30px] rounded-md'
										: 'block p-2 rounded-md text-[30px]'
								}
								onClick={() => handleToggleHamburger()}
							>
								{el.name}
							</NavLink>
						</li>
					))}
				</>
			);
		} else {
			return (
				<>
					<li className='w-auto rounded-md '>
						<button
							className={
								'block w-full text-[30px] text-left p-3 lg:p-2 rounded-md hover:underline hover:underline-offset-4 uppercase font-medium text-secondary-light'
							}
							onClick={() => {
								handleLogoutFunctionality();
								handleToggleHamburger();
							}}
						>
							{'Logout'}
						</button>
					</li>
					<li
						className=' absolute top-2 left-2 w-[150px]'
						onClick={handleToggleDropdown}
					>
						<Link
							to={'/profile'}
							className='flex items-center gap-1 cursor-pointer'
						>
							<figure>
								<img
									src={avi}
									alt='user avi'
									className='w-[38px] h-[38px] rounded-[48px]'
								/>
							</figure>
							<p className='font-exo font-[600] text-secondary-light hover:text-secondary-dark'>
								{userDetails ? userDetails?.name : 'Annette Black'}
							</p>
						</Link>
					</li>
				</>
			);
		}
	};

	const handleDisplayProfileBtn = () => {
		if (!userDetails) {
			return rightLinks?.map((el) => (
				<li key={el.id}>
					<NavLink
						to={el.path}
						className={({ isActive }) =>
							isActive
								? 'block p-2 text-secondary-dark'
								: 'p-2 block hover:text-secondary-dark'
						}
					>
						{el.name}
					</NavLink>
				</li>
			));
		} else {
			return (
				<li className='relative' onClick={handleToggleDropdown}>
					<button className='flex items-center gap-1 cursor-pointer'>
						<figure>
							<img
								src={
									userDetails
										? `${config.baseUrl}/img/${userDetails?.photo}`
										: avi
								}
								alt='user avi'
								className='w-[38px] h-[38px] rounded-[48px]'
							/>
						</figure>
						<p className='font-exo font-[600] text-secondary-light hover:text-secondary-dark'>
							{userDetails ? userDetails?.name : 'Annette Black'}
						</p>

						<img
							src={angleIcon}
							alt='angle arrow depicting a closed menu'
							className={`${
								toggleDropdown
									? 'rotate-180 duration-75'
									: 'rotate-0 duration-75'
							}`}
						/>
					</button>
					{toggleDropdown && (
						<ul className='absolute z-20 border w-[12rem] -right-4 top-[3.5rem] bg-white rounded-lg'>
							{dropdown.map((el) => (
								<Fragment key={el.id}>
									{el.name === 'Logout' ? (
										<li className='w-auto rounded-md '>
											<button
												className={
													'p-2 px-6 font-semibold bg hover:bg-secondary-dark rounded-md text-secondary-light hover:text-white w-full text-left'
												}
												onClick={() => {
													handleLogoutFunctionality();
													// handleToggleHamburger();
												}}
											>
												{'Logout'}
											</button>
										</li>
									) : (
										<li className='px-3 hover:bg-secondary-dark rounded-md'>
											<Link to={el.path} className='block p-2 hover:text-white'>
												{el.name}
											</Link>
										</li>
									)}
								</Fragment>
							))}
						</ul>
					)}
				</li>
			);
		}
	};

	// TODO: make this slide into view
	const MobileNav: FC = () => {
		return (
			<div
				className={`${
					HamburgerState ? 'left-0' : ' left-full'
				} fixed z-40 w-full h-svh rounded-md p-3 top-0 bg-white block overflow-auto transition-all duration-1000 transform ease-in-out `}
			>
				<div className='absolute right-0'>
					<HamburgerBtn
						toggleHamburger={handleToggleHamburger}
						HamburgerState={HamburgerState}
					/>
				</div>
				<div className='flex flex-col w-[60%] h-[90vh] m-auto mt-[50px] justify-between'>
					<div className='flex flex-col'>
						<h1 className='w-full text-xs my-3 uppercase border-b-2 border-black pb-1'>
							Navigation
						</h1>
						<ul className='w-full gap-1 sm:flex lg:gap-2'>
							{loopFromMobile?.map((el) => (
								<li
									key={el.id}
									className='w-full rounded-md hover:underline hover:underline-offset-4  uppercase'
								>
									<NavLink
										to={el.path}
										className={({ isActive }) =>
											isActive
												? 'block p-2 underline underline-offset-4 text-[30px] rounded-md text-black'
												: 'block p-2 rounded-md text-[30px]'
										}
										onClick={() => handleToggleHamburger()}
									>
										{el.name}
									</NavLink>
								</li>
							))}
						</ul>
						<ul className='items-center sm:flex'>
							{handleMobileDisplayProfileBtn()}
						</ul>
					</div>
				</div>
			</div>
		);
	};

	return (
		<header className=' h-[80px]'>
			<nav className='w-100 max-w-[95rem] mx-auto h-full bg-white px-4 rounded-lg shadow-md'>
				<div className='flex items-center h-full gap-3 relative'>
					<div className=''>
						<Logo />
					</div>

					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='1'
						height='28'
						viewBox='0 0 1 48'
						fill='none'
					>
						<path
							d='M0.5 8V40'
							stroke='#E7E9F0'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>

					<div className='hidden sm:flex justify-between items-center basis-full'>
						<ul className='basis-auto gap-1 sm:flex lg:gap-2'>
							{loopFrom?.map((el) => (
								<li key={el.id} className='w-auto'>
									<NavLink
										to={el.path}
										className={({ isActive }) =>
											isActive
												? 'block p-1 lg:p-2 text-secondary-dark'
												: 'p-1 lg:p-2 block hover:text-secondary-dark'
										}
									>
										{el.name}
									</NavLink>
								</li>
							))}
						</ul>

						<ul className='items-center sm:flex'>
							{handleDisplayProfileBtn()}
						</ul>
					</div>
					<ul className='ms-auto sm:hidden'>
						<li>
							<HamburgerBtn
								toggleHamburger={handleToggleHamburger}
								HamburgerState={HamburgerState}
							/>
						</li>
					</ul>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
};

export default LayoutHeader;

// const MobileNav: FC = () => {
// 	return (
// 		<div
// 			className={`absolute z-40 w-[250px] h-[88%] rounded-md p-3 top-[80px] sm:hidden bg-white block ${
// 				HamburgerState ? '-translate-x-[1rem]' : '-translate-x-[20rem]'
// 			} `}
// 		>
// 			<ul className='basis-auto gap-1 sm:flex lg:gap-2'>
// 				{mobileNav?.map((el) => (
// 					<li
// 						key={el.id}
// 						className='w-auto rounded-md hover:bg-secondary-dark'
// 					>
// 						<NavLink
// 							to={el.path}
// 							className={({ isActive }) =>
// 								isActive
// 									? 'block p-3 lg:p-2 bg-secondary-dark text-white rounded-md'
// 									: 'p-3 lg:p-2 block hover:text-white rounded-md'
// 							}
// 						>
// 							{el.name}
// 						</NavLink>
// 					</li>
// 				))}
// 			</ul>

// 			<ul className='items-center sm:flex'>
// 				{!userDetails ? (
// 					rightLinks?.map((el) => (
// 						<li key={el.id}>
// 							<NavLink
// 								to={el.path}
// 								className={({ isActive }) =>
// 									isActive
// 										? 'block p-3 lg:p-2 bg-secondary-dark text-white rounded-md'
// 										: 'p-3 lg:p-2 block hover:text-white rounded-md'
// 								}
// 							>
// 								{el.name}
// 							</NavLink>
// 						</li>
// 					))
// 				) : (
// 					<>
// 						<li className='w-auto rounded-md '>
// 							<button
// 								className={
// 									'block p-3 lg:p-2 rounded-md hover:text-white hover:bg-secondary-dark'
// 								}
// 							>
// 								{'Logout'}
// 							</button>
// 						</li>
// 						<li className='absolute bottom-5' onClick={handleToggleDropdown}>
// 							<Link
// 								to={'/profile'}
// 								className='flex items-center gap-1 cursor-pointer'
// 							>
// 								<figure>
// 									<img
// 										src={avi}
// 										alt='user avi'
// 										className='w-[38px] h-[38px] rounded-[48px]'
// 									/>
// 								</figure>
// 								<p className='font-exo font-[600] text-secondary-light hover:text-secondary-dark'>
// 									{userDetails ? userDetails?.name : 'Annette Black'}
// 								</p>
// 							</Link>
// 						</li>
// 					</>
// 				)}
// 			</ul>
// 		</div>
// 	);
// };
