import SlimSelect from 'slim-select';
import "./theme.css";
// @ts-ignore
import "slim-select/styles";

export function initSelectors() {
    document.querySelectorAll('.slct').forEach((el)=>{
        new SlimSelect({
            select: el as HTMLSelectElement,
            settings: {
                closeOnSelect: true,
                allowDeselect: true,
                showSearch: false,
            }
        });
    });
}
