const Admin = () => {
    return (
        <div>
            <h2>
                Admin panel
            </h2>
            <div>
                <a href='/user-list' className="fs-5"> User list </a>
            </div>
            <div>
                <a href='/rooms' className="fs-5"> Rooms list </a>
            </div>
        </div>
    )
}

export default Admin;