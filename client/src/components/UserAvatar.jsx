const UserAvatar = ({ name, photo, size = 40 }) => {
    const getInitial = (name) => name?.charAt(0).toUpperCase();
    const dimension = `${size}px`;

    return photo ? (
        <img
            src={photo}
            alt="Profile"
            className="rounded-full object-cover"
            style={{
                width: dimension,
                height: dimension,
            }}
        />
    ) : (
        <div
            className="rounded-full bg-orange-600 text-black border-0 outline-6 outline-[#1f1f1f] flex items-center justify-center font-semibold"
            style={{
                width: dimension,
                height: dimension,
                fontSize: `${size / 2}px`,
            }}
        >
            {getInitial(name)}
        </div>
    );
};

export default UserAvatar;
