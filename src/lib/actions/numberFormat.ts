export function numberFormat(node:HTMLInputElement, defaultValue?:number) {
    console.log("numberFormat", node, defaultValue);
    node.value = defaultValue?.toString() || "";
    let lastValue = defaultValue;
    function handleChange(event:KeyboardEvent) {
            //regex to remove all non-numeric characters
            
            // eslint-disable-next-line no-useless-escape
            const regex = /[^0-9]/g;
            
            const tempNumber = node.value.replace(regex, "");
            //remove all periods except the first
            lastValue = Number(tempNumber);
            if( isNaN(lastValue) ) {
                lastValue = 0;
            }
            const commaSeparatedNumber = lastValue.toLocaleString("es-MX");//tempNumber.split(/(?=(?:\d{3})+$)/).join(",");
            node.value = commaSeparatedNumber;
            
            node.dispatchEvent(new CustomEvent<number>("change_value", { detail: lastValue }));
    }
    node.addEventListener("keyup",handleChange)

	return {
        update(newValue:number) {
            if (newValue === lastValue) return;
            lastValue = newValue;
            node.value = newValue?.toString() || "";
        },
		destroy() {
			node.removeEventListener("keyup", handleChange, true);
		}
	};
}

export function decimalFormat(node:HTMLInputElement, defaultValue?:number) {
    console.log("numberFormat", node, defaultValue);
    node.value = defaultValue?.toString() || "";
    let lastValue = defaultValue;
    function handleChange(event:KeyboardEvent) {
            //regex to remove all non-numeric characters except periods
            let lastchar = "";
            
            // eslint-disable-next-line no-useless-escape
            const regex = /[^0-9\.]/g;
            
            let tempNumber = node.value.replace(regex, "");
            if( tempNumber.endsWith(".") ) {
                lastchar = ".";
            }
            //remove all periods except the first
            tempNumber = tempNumber.replace(/[.](?=.*[.])/g, "");
            lastValue = Number(tempNumber);
            const commaSeparatedNumber = lastValue.toLocaleString("es-MX")+lastchar;//tempNumber.split(/(?=(?:\d{3})+$)/).join(",");
            node.value = commaSeparatedNumber;
            
            node.dispatchEvent(new CustomEvent<number>("change_value", { detail: lastValue }));
    }
    node.addEventListener("keyup",handleChange)

	return {
        update(newValue:number) {
            if (newValue === lastValue) return;
            lastValue = newValue;
            node.value = newValue?.toString() || "";
        },
		destroy() {
			node.removeEventListener("keyup", handleChange, true);
		}
	};
}