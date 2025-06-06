import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from './ui/avatar'
import { FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const ResponsiveMenu = ({ openNav, setOpenNav, logoutHandler }) => {
    const { user } = useSelector(store => store.auth)
    return (
        <div className={`${openNav ? "left-0" : "-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-800 px-8 pb-6 pt-16 text-black dark:text-gray-100 md:hidden rounded-r-xl shadow-md transition-all`}>
            <div>
                <div className="flex items-center justify-start gap-3">
                    {
                        user ? <Avatar className="w-14 h-14">
                            <AvatarImage src={user.photoUrl} size={50} />
                        </Avatar> : <FaUserCircle size={50} />
                    }
                    <div>
                        <h1>Hello, {user?.firstName || "User"}</h1>
                        <h1 className='text-sm text-slate-500'>Premium User</h1>
                    </div>
                </div>
                <nav className="mt-12">
                    <ul className="flex flex-col gap-7 text-2xl font-semibold">
                        <Link to={'/'} onClick={() => setOpenNav(false)}><li>Home</li></Link>
                        <Link to={'/blogs'} onClick={() => setOpenNav(false)}><li>Blogs</li></Link>
                        <Link to={'/about'} onClick={() => setOpenNav(false)}><li>About</li></Link>
                        {
                            user ? <Button onClick={() => { logoutHandler(), setOpenNav(false) }}>Logout</Button> : <Link to={'/signup'}><Button onClick={() => setOpenNav(false)}>Signup</Button></Link>
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default ResponsiveMenu