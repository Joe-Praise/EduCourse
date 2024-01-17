import { FC, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import angleIcon from '../../../assets/icon/chevron-down.svg';
import avi from '../../../assets/image/Ellipse 1.jpg';
import { linkType } from '../model/navigationType';
import useHandleModal from '../../../hooks/UseHandleModal';
import HamburgerBtn from '../../../components/HamburgerBtn';
import Logo from '../../../components/Logo';

const LayoutHeader: FC = () => {
	const {
		modal: toggleDropdown,
		handleModal: handleToggleDropdown,
		// closeModal: closeDropdown,
	} = useHandleModal();

	// TODO: check URL, if chnaged. r=trigger handleToggleHamburger

	const { modal: HamburgerState, handleModal: handleToggleHamburger } =
		useHandleModal();

	const [user] = useState(true);
	const leftLnks: linkType[] = [
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
			path: '/blog',
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
			path: '/login',
		},
		{
			id: 2,
			name: 'Register',
			path: '/register',
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
			path: '/blog',
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

	const MobileNav: FC = () => {
		return (
			<div
				className={`absolute z-40 w-[250px] h-[88%] rounded-md p-3 top-[80px] sm:hidden bg-white block ${
					HamburgerState ? '-translate-x-[1rem]' : '-translate-x-[20rem]'
				} `}
			>
				<ul className='basis-auto gap-1 sm:flex lg:gap-2'>
					{mobileNav?.map((el) => (
						<li
							key={el.id}
							className='w-auto rounded-md hover:bg-secondary-dark'
						>
							<NavLink
								to={el.path}
								className={({ isActive }) =>
									isActive
										? 'block p-3 lg:p-2 bg-secondary-dark text-white rounded-md'
										: 'p-3 lg:p-2 block hover:text-white rounded-md'
								}
							>
								{el.name}
							</NavLink>
						</li>
					))}
				</ul>

				<ul className='items-center sm:flex'>
					{!user ? (
						rightLinks?.map((el) => (
							<li key={el.id}>
								<NavLink
									to={el.path}
									className={({ isActive }) =>
										isActive
											? 'block p-3 lg:p-2 bg-secondary-dark text-white rounded-md'
											: 'p-3 lg:p-2 block hover:text-white rounded-md'
									}
								>
									{el.name}
								</NavLink>
							</li>
						))
					) : (
						<>
							<li className='w-auto rounded-md '>
								<button
									className={
										'block p-3 lg:p-2 rounded-md hover:text-white hover:bg-secondary-dark'
									}
								>
									{'Logout'}
								</button>
							</li>
							<li className='absolute bottom-5' onClick={handleToggleDropdown}>
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
										Annette Black
									</p>
								</Link>
							</li>
						</>
					)}
				</ul>
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
							{leftLnks?.map((el) => (
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
							{!user ? (
								rightLinks?.map((el) => (
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
								))
							) : (
								<li className='relative' onClick={handleToggleDropdown}>
									<Link
										to={''}
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
											Annette Black
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
									</Link>

									{toggleDropdown && (
										<ul className='absolute z-20 border w-[12rem] -right-4 top-[3.5rem] bg-white rounded-lg'>
											{dropdown.map((el) => (
												<li
													className='px-3 hover:bg-secondary-dark  rounded-md'
													key={el.id}
												>
													<Link
														to={el.path}
														className='block p-2 hover:text-white'
													>
														{el.name}
													</Link>
												</li>
											))}
										</ul>
									)}
								</li>
							)}
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
