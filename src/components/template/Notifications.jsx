// Import Dependencies
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import PropTypes from "prop-types";
import {
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

// Local Imports
import { Avatar, AvatarDot, Badge, Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import AlarmIcon from "assets/dualicons/alarm.svg?react";
import GirlEmptyBox from "assets/illustrations/girl-empty-box.svg?react";
import { socket } from 'app/pages/dashboards/home'

// Import du son de notification
import notificationSound from 'assets/notification.mp3';

// ----------------------------------------------------------------------

// Notifications initiales
const initialNotifications = [
  {
    id: 1,
    title: "Connecté",
    description: "Vous vous êtes connecté avec succès",
    time: "à l'instant",
  },
];

export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const audioRef = useRef(null);

  // Charger le son de notification
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.3; // Volume à 30%
  }, []);

  useEffect(() => {
    // Écouter les événements Socket.io pour les commandes
    const handleNewOrder = (orderData) => {
      console.log("orderData", orderData);
      
      const newNotification = {
        id: Date.now() + Math.random(),
        title: "Nouvelle commande",
        description: `Commande #${orderData.id} - ${orderData.total_price} FCFA`,
        time: "à l'instant",
        orderData: orderData,
        timestamp: new Date(),
      };

      // Jouer le son de notification
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Réinitialiser le son
        audioRef.current.play().catch(error => {
          console.log("Erreur de lecture audio:", error);
        });
      }

      setNotifications(prev => [newNotification, ...prev]);
    };



     const handleCancelOrder = (orderData) => {
      console.log("orderData", orderData);
      
      const newNotification = {
        id: Date.now() + Math.random(),
        title: "commande Annuler",
        description: `Commande #${orderData.id} - ${orderData.total_price} FCFA`,
        time: "à l'instant",
        orderData: orderData,
        timestamp: new Date(),
      };

      // Jouer le son de notification
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Réinitialiser le son
        audioRef.current.play().catch(error => {
          console.log("Erreur de lecture audio:", error);
        });
      }

      setNotifications(prev => [newNotification, ...prev]);
    };


    const handleOrderUpdate = (orderData) => {
      const newNotification = {
        id: Date.now() + Math.random(),
        title: "Commande mise à jour",
        description: `Commande #${orderData.id} - Statut: ${orderData.status == "delivered"? "livrer":
          orderData.status 
        }`,
        time: "à l'instant",
        orderData: orderData,
        timestamp: new Date(),
      };

      // Jouer le son aussi pour les mises à jour si souhaité
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.log("Erreur de lecture audio:", error);
        });
      }

      setNotifications(prev => [newNotification, ...prev]);
    };

    // S'abonner aux événements Socket.io
    socket.on('order:store', handleNewOrder);
     socket.on('order:cancel', handleCancelOrder);
    socket.on('order:delivered', handleOrderUpdate);
    return () => {
      // Se désabonner des événements
      socket.off('order:store', handleNewOrder);
      socket.off('order:cancel', handleCancelOrder);
      socket.off('order:delivered', handleOrderUpdate);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications((n) => n.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "à l'instant";
    
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);
    
    if (diffInSeconds < 60) return `il y a ${diffInSeconds} seconde(s)`;
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minute(s)`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heure(s)`;
    
    return `il y a ${Math.floor(diffInSeconds / 86400)} jour(s)`;
  };

  return (
    <Popover className="relative flex">
      <PopoverButton
        as={Button}
        variant="flat"
        isIcon
        className="relative size-9 rounded-full"
      >
        <AlarmIcon className="size-6 text-gray-900 dark:text-dark-100" />
        {notifications.length > 0 && (
          <AvatarDot
            color="error"
            isPing
            className="top-0 ltr:right-0 rtl:left-0"
          />
        )}
      </PopoverButton>
      <Transition
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <PopoverPanel
          anchor={{ to: "bottom end", gap: 8 }}
          className="z-[70] mx-4 flex h-[min(32rem,calc(100vh-6rem))] w-[calc(100vw-2rem)] flex-col rounded-lg border border-gray-150 bg-white shadow-soft dark:border-dark-800 dark:bg-dark-700 dark:shadow-soft-dark sm:m-0 sm:w-80"
        >
          {({ close }) => (
            <div className="flex grow flex-col overflow-hidden">
              <div className="rounded-t-lg bg-gray-100 dark:bg-dark-800">
                <div className="flex items-center justify-between px-4 pt-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800 dark:text-dark-100">
                      Notifications
                    </h3>
                    {notifications.length > 0 && (
                      <Badge
                        color="primary"
                        className="h-5 rounded-full px-1.5"
                        variant="soft"
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </div>
                  <Button
                    component={Link}
                    to="/settings/notifications"
                    className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                    isIcon
                    variant="flat"
                    onClick={close}
                  >
                    {/* Icône de paramètres ou fermeture */}
                  </Button>
                </div>
              </div>

              {notifications.length > 0 ? (
                <>
                  <div className="custom-scrollbar grow space-y-4 overflow-y-auto overflow-x-hidden p-4">
                    {notifications.map((item) => (
                      <NotificationItem
                        key={item.id}
                        remove={removeNotification}
                        data={item}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                  <div className="shrink-0 overflow-hidden rounded-b-lg bg-gray-100 dark:bg-dark-800">
                    <Button
                      className="w-full rounded-t-none"
                      onClick={clearNotifications}
                    >
                      <span>Tout effacer</span>
                    </Button>
                  </div>
                </>
              ) : (
                <Empty />
              )}
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}

function Empty() {
  const { primaryColorScheme: primary, darkColorScheme: dark } =
    useThemeContext();
  return (
    <div className="grid grow place-items-center text-center">
      <div className="">
        <GirlEmptyBox
          className="mx-auto w-40"
          style={{ "--primary": primary[500], "--dark": dark[500] }}
        />
        <div className="mt-6">
          <p>Aucune nouvelle notification</p>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ data, remove, formatTime }) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-dark-600">
      <div className="flex min-w-0 gap-3">
        <Avatar
          size={10}
          initialColor="primary"
          classNames={{ display: "rounded-lg" }}
        >
          <AlarmIcon className="size-4.5" />
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="-mt-0.5 truncate font-medium text-gray-800 dark:text-dark-100">
            {data.title}
          </p>
          <div className="mt-0.5 text-xs text-gray-600 dark:text-dark-200">
            {data.description}
          </div>
          <div className="mt-1 text-xs text-gray-400 dark:text-dark-300">
            {data.timestamp ? formatTime(data.timestamp) : data.time}
          </div>
        </div>
      </div>
      <Button
        variant="flat"
        isIcon
        onClick={() => remove(data.id)}
        className="size-7 rounded-full opacity-0 group-hover:opacity-100 ltr:-mr-2 rtl:-ml-2"
      >
        <ArchiveBoxXMarkIcon className="size-4" />
      </Button>
    </div>
  );
}

NotificationItem.propTypes = {
  data: PropTypes.object,
  remove: PropTypes.func,
  formatTime: PropTypes.func,
};