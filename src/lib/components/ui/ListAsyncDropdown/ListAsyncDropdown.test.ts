import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, queryByText, render } from "@testing-library/svelte";
import ListAsyncDropdown  from "./ListAsyncDropdown.svelte";


describe("ListAsyncDropdown renderer", () => {
    afterEach(() => {
        cleanup();
    });

    it("should be empty if no actions and no base", () => {

        const {queryByTestId} =render(ListAsyncDropdown,{});
        const button = queryByTestId("card-menu-button");
        expect(button).not.toBeInTheDocument(); // Use the toBeInTheDocument function
        // expect(data).not.toBeNull();

    }); 

    //inject cell object in props with data._list = ["Activo","Inactivo"] , data._field = "status", data._node = "node", data.status = undefined
    // it should display "Activio" as default value
    it("should display default value", () => {
        const data = { _list: ["Activo", "Inactivo"], _field: "status", _node: "node", status: undefined };
        const { getByText } = render(ListAsyncDropdown, { cell: {data} });
        const button = getByText("-");
        expect(button).toBeDefined();
    });
    it("should display a selected value", () => {
        const data = { _list: ["Activo", "Inactivo"], _field: "status", _node: "node", status: 0 };
        const { getByText } = render(ListAsyncDropdown, { cell: {data} });
        const button = getByText("Activo");
        expect(button).toBeDefined();
    });
    // click on the button and check if the div with buttons is displayed
    it("should display the div with buttons", async () => {
        const data = { _list: ["Activo", "Inactivo"], _field: "status", _node: "node", status: 0 };
        const { getByRole, getByText } = render(ListAsyncDropdown, { cell: {data} });
        const button = getByText("Activo");
        expect(button).toBeDefined();
        await fireEvent.click(button);
        // has div.card with 2 buttons in it
        const div = getByRole("listbox");
        expect(div).toBeDefined();
        const buttons = div.querySelectorAll("button");
        expect(buttons.length).toBe(2);

    });
    //click on the second button and check if the value is changed
    it("should change the value", async () => {
        const data = { _list: ["Activo", "Inactivo"], _field: "status", _node: "node", status: 0 };
        const { getByRole, getByText, queryAllByRole } = render(ListAsyncDropdown, { cell: {data} });
        const button = getByText("Activo");
        expect(button).toBeDefined();
        await fireEvent.click(button);
        // has div.card with 2 buttons in it
        const div = getByRole("listbox");
        expect(div).toBeDefined();
        const buttons = div.querySelectorAll("button");
        expect(buttons.length).toBe(2);
        await fireEvent.click(buttons[1]);
        const newButton = queryAllByRole("button")[0];

        expect(newButton).toHaveTextContent("Inactivo");
    });

    //inject cell object in props with data._list = ["Activo","Inactivo"] , data._field = "status", data._node = "node", data.status = undefined
    // it should display "Activio" as default value
    it("should display default value", () => {
        const data = { list: ["Activo", "Inactivo"], field: "status", subcol: ["node"], value: undefined };
        const { getByText } = render(ListAsyncDropdown,  data);
        const button = getByText("-");
        expect(button).toBeDefined();
    });
    it("should display a selected value", () => {
        const data = { list: ["Activo", "Inactivo"], field: "status", subcol: ["node"], value: 0 };
        const { getByText } = render(ListAsyncDropdown, data);
        const button = getByText("Activo");
        expect(button).toBeDefined();
    });
    // click on the button and check if the div with buttons is displayed
    it("should display the div with buttons", async () => {
        const data = { list: ["Activo", "Inactivo"], field: "status", subcol: ["node"], value: 0 };
        const { getByRole, getByText } = render(ListAsyncDropdown, data);
        const button = getByText("Activo");
        expect(button).toBeDefined();
        await fireEvent.click(button);
        // has div.card with 2 buttons in it
        const div = getByRole("listbox");
        expect(div).toBeDefined();
        const buttons = div.querySelectorAll("button");
        expect(buttons.length).toBe(2);

    });
    //click on the second button and check if the value is changed
    it("should change the value", async () => {
        const data = { list: ["Activo", "Inactivo"], field: "status", subcol: ["node"], value: 0 };
        const { getByRole, getByText, queryAllByRole } = render(ListAsyncDropdown, data);
        const button = getByText("Activo");
        expect(button).toBeDefined();
        await fireEvent.click(button);
        // has div.card with 2 buttons in it
        const div = getByRole("listbox");
        expect(div).toBeDefined();
        const buttons = div.querySelectorAll("button");
        expect(buttons.length).toBe(2);
        await fireEvent.click(buttons[1]);
        const newButton = queryAllByRole("button")[0];

        expect(newButton).toHaveTextContent("Inactivo");
    });

});