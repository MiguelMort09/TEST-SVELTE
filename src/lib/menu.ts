import { derived } from "svelte/store";
import { permissions} from "./user";

type MenuItem ={
    icon:string,
    name:string,
    link:string,
    access:string[]
}
type MenuDivider ={
    divider:boolean
}


const baseMenu:(MenuItem|MenuDivider)[] = [
    // {name:"Inicio",link:"/"},
    {name:"Tareas", icon:"",link:"/tasks", access:[]},

    ];

export const menuMain =[
    {name:"Inicio",link:"/", icon:""}
    ]
    
export const menuSide = derived<typeof permissions,(MenuItem|MenuDivider)[]>(permissions,($permissions,set)=>{
    const resultMenu:(MenuItem|MenuDivider)[] = [];
    for (let index = 0; index < baseMenu.length; index++) {
        const element = baseMenu[index];
        if( "divider" in element){
            resultMenu.push(element);
        }else{
            if("access" in element){
                // console.log("access ", element.name, $permissions);
                if($permissions.admin == true || element.access.length == 0  || element.access.some(a=>Object.keys($permissions).includes(a))){
                    resultMenu.push(element);
                }
            }else {
                resultMenu.push(element);
            }
        }
        
    }
    set(resultMenu);
}, []);

export const menuUser = [

]

