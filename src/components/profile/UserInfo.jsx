import React from "react";
import "../../styles/profile.css";
import simpleLogo from "../../assets/simple-logo.svg";
import { TextInput } from "../common/input/Input";
import { Button } from "../common/button/button";

const   UserInfo = ({user}) => {
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month}. ${year}`;
  };
  return (
    <div className="">
      {user && (
        <div>
          <div className="max-w-4xl mx-auto">
            <div className="w-full rounded-lg p-6">
              <img
                src={simpleLogo}
                alt="Logo Bata"
                className="h-16 mx-auto my-3"
              />
              <h2 className="text-xl font-bold text-center text-gray-800">
                Tu perfil
              </h2>
              <p className="text-sm text-center text-gray-500 mb-6">
                Modificá los datos de tu perfil
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center border-b pb-4">
              <label className="font-semibold text-gray-800">
                Email
              </label>
              <TextInput
                id="email"
                type="email"
                value={user?.email}
                // onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="grid grid-cols-3 gap-4 items-center border-b pb-4">
              <label className="font-semibold text-gray-800">
                Nombre y apellido
              </label>
              <TextInput
                id="name"
                type="name"
                value={user?.name}
                // onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              <TextInput
                id="email"
                type="email"
                value={user?.lastName}
                // onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="grid grid-cols-3 gap-4 items-center border-b py-4">
              <label className="font-semibold text-gray-800">Avatar</label>
              <div className="col-span-2">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center border-b py-4">
              <label className="font-semibold text-gray-800">Contraseña</label>
              <Button variant="darkBlue" label="Cambiar contraseña" />
            </div>
            <div className="grid grid-cols-3 gap-4 items-center border-b py-4">
              <label className="font-semibold text-gray-800">
                Lenguajes en proceso
              </label>
              <div className="col-span-2 flex space-x-4">
                {user?.languages?.map((friend) => (
                  <img
                    src="/avatars/user1.png"
                    alt="Amigo 1"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center py-4">
              <label className="font-semibold text-gray-800">Tus amigos</label>
              <div className="col-span-2 flex space-x-4">
                {user?.friends?.map((friend) => (
                  <img
                    src="/avatars/user1.png"
                    alt="Amigo 1"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
