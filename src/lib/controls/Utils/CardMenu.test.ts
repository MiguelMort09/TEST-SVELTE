import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, queryByText, render } from "@testing-library/svelte";
import CardMenu  from "./CardMenu.svelte";


describe("CardMenu render", () => {
    const actions= [{id:"actiontest",name:"test", action:()=>{ return}}];
    // let data:any = null;

    // beforeEach(async () => {
    //     data = (await import("../../tests/mock-data/proyects.json")).default;
    //     //create instance of the component and mount it
    // })

//     afterEach(() => {
//         //destory/unmount instance
//     })// await fireEvent.click(button)
    
    it("should be empty if no actions and no base", () => {

        const {queryByTestId} =render(CardMenu,{});
        const button = queryByTestId("card-menu-button");
        expect(button).not.toBeInTheDocument();
        // expect(data).not.toBeNull();

    });

    it("should not be empty if base", () => {

        const {queryByTestId} =render(CardMenu,{base:"crud"});
        const button = queryByTestId("card-menu-button");
        expect(button).toBeDefined(); 
        expect(button).toBeInTheDocument(); 
    });

    it("should be defined and menu hidden", () => {
        const { getByTestId} =render(CardMenu,{actions:actions});
        const button = getByTestId("card-menu-button");
        expect(button).toBeDefined(); 
        //expect(screen.get).toHaveClass("hidden");
        const menu = getByTestId("card-menu"); 
        expect(menu).not.toHaveClass("show");
    });

    it("should be defined and menu shown after click", async () => {
        
        const {getByRole, getByTestId} =render(CardMenu,{actions:actions});
        const button = getByTestId("card-menu-button");
        expect(button).toBeDefined(); 
        //expect(screen.get).toHaveClass("hidden");
        await fireEvent.click(button);
        const menu = getByTestId("card-menu"); 
        expect(menu).toHaveClass("show");
    });
    it("should hide the menu", async () => {
        
        const {getByRole, getByTestId} =render(CardMenu,{actions:actions});
        const button = getByTestId("card-menu-button");
        expect(button).toBeDefined(); 
        //expect(screen.get).toHaveClass("hidden");
        await fireEvent.click(button);
        const menu = getByTestId("card-menu"); 
        expect(menu).toHaveClass("show");
        await fireEvent.click(button);
        expect(menu).not.toHaveClass("show");
    });

    it("should be defined and menu options", async () => {
        
        const {getByTestId, getByText} =render(CardMenu,{actions:actions});
        const button = getByTestId("card-menu-button");
        expect(button).toBeDefined(); 
        //expect(screen.get).toHaveClass("hidden");
        await fireEvent.click(button);
        const menu = getByText(actions[0].name); 
        expect(menu).toBeVisible();
    });
    it("should have base only edit action", async () => {
        
        const {getByTestId, getByText, queryByText} =render(CardMenu,{actions:actions, base:"edit"});
        const button = getByTestId("card-menu-button");
        expect(button).toBeDefined(); 
        //expect(screen.get).toHaveClass("hidden");
        await fireEvent.click(button);
        const menu = getByText("Editar"); 
        const menuBorrar = queryByText("Borrar"); 
        expect(menu).toBeVisible();
        expect(menuBorrar).not.toBeInTheDocument();
    });
    it("should have base edit and delete action", async () => {
        
        const {getByTestId, getByText, queryByText} =render(CardMenu,{actions:actions, base:"crud"});
        const button = getByTestId("card-menu-button");
        expect(button).toBeDefined(); 
        //expect(screen.get).toHaveClass("hidden");
        await fireEvent.click(button);
        const menu = getByText("Editar"); 
        const menuBorrar = getByText("Eliminar"); 
        const menuDuplicar = queryByText("Borrar"); 
        expect(menu).toBeVisible();
        expect(menuBorrar).toBeVisible();
        expect(menuDuplicar).not.toBeInTheDocument();
    });
    it("should have base edit, delete and duplicate action", async () => {
        
        const {getByTestId, getByText} =render(CardMenu,{actions:actions, base:"duplicate"});
        const button = getByTestId("card-menu-button");
        expect(button).toBeDefined(); 
        //expect(screen.get).toHaveClass("hidden");
        await fireEvent.click(button);
        const menu = getByText("Editar"); 
        const menuBorrar = getByText("Eliminar"); 
        const menuDuplicar = getByText("Duplicar"); 
        expect(menu).toBeVisible();
        expect(menuBorrar).toBeVisible();
        expect(menuDuplicar).toBeVisible();
    });
    it("should fire events of edit, delete and duplicate action", async () => {
        
        const {getByTestId, getByText, component} =render(CardMenu,{actions:actions, base:"duplicate"});
        const button = getByTestId("card-menu-button");
        expect(button).toBeDefined();
        const mockEdit = vi.fn((event:any) => (event.detail)); 
        component.$on("edit", mockEdit);
        //expect(screen.get).toHaveClass("hidden");
        await fireEvent.click(button);
        const menu = getByText("Editar"); 
        await fireEvent.click(menu);
        expect(mockEdit).toHaveBeenCalled();

        const menuBorrar = getByText("Eliminar");
        const mockDelete = vi.fn((event:any) => (event.detail));
        component.$on("delete", mockDelete);
        await fireEvent.click(menuBorrar);
        expect(mockDelete).toHaveBeenCalled();
        
        
        const menuDuplicar = getByText("Duplicar");
        const mockDuplicate = vi.fn((event:any) => (event.detail));
        component.$on("duplicate", mockDuplicate);
        await fireEvent.click(menuDuplicar);
        expect(mockDuplicate).toHaveBeenCalled();      
    });
});