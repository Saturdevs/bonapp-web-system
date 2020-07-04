import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '..';

@Pipe({
  name: 'categorySearch'
})
export class CategorySearchPipe implements PipeTransform {

  transform(categoryItems: Array<Category>, name: string, menuId: string): Category[] {
    if (categoryItems && categoryItems.length) {
      return categoryItems.filter(category => {
        if (name && name !== 'default' && category.name.toLowerCase().indexOf(name.toLowerCase()) === -1) {
          return false;
        }
        if (menuId && menuId !== 'default' && category.menu._id.toLowerCase().indexOf(menuId.toLowerCase()) === -1) {
          return false;
        }
        return true;
      })
    } else {
      return categoryItems;
    }
  }

}
