import { INavData } from "@coreui/angular";



export const navItems: INavData[] = [
  {
    name: "Schools",
    url: "/dash/school",
    icon: "fa fa-building",
    // badge: {
    //   variant: "info",
    //   text: "NEW",
    // },
  },
  {
    name: "Admin",
    url: "/dash/admin",
    icon: "icon-user",
  },
  {
    name: "Users",
    url: "/dash/users",
    icon: "cui-people",
  },
  {
    name: "Incidents",
    url: "/dash/incidents",
    icon: "cui-speech",
  },
  {
    name: "Teachers",
    url: "/dash/teachers",
    icon: "fa fa-id-badge",
  },
  {
    name: "BusRoute",
    url: "/dash/busroute",
    icon: "fa fa-bus",
  },
  {
    name: "EmergencyReport",
    url: "/dash/emergencyreport",
    icon: "fa fa-warning",
  },
  {
    name: "State",
    url: "/dash/state",
    icon: "cui-location-pin",
  },
  // {
  //   name: "UserType",
  //   url: "/dash/usertype",
  //   icon: "fa fa-vcard",
  // },
  {
    divider: true,
  },

  {
    name: "Bereavement",
    url: "/dash/bereavement",
    icon: "cui-bold",
  },
  {
    divider:true,
  },
  {
    name: "Templates",
    url: "/dash/template",
    icon: "icon-note",
  },
  {
    divider: true,
  },
  {
    name: "LogOut",
    url: "/login",
    icon: "icon-lock",
  },
];




  //  INavData.push( {
  //   name:"Approve School",
  //   url:"/dash/approveschool",
  //   icon:"fa fa-building"
  // })
