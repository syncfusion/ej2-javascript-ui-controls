import { Property, ChildProperty, Collection } from '@syncfusion/ej2-base';
import { PredicateModel, Predicate, ICustomOptr } from '@syncfusion/ej2-grids';
import { FilterType, FilterHierarchyMode } from '../base/enum';
/**
 * Configures the filtering behavior of the Gantt.
 */
export class FilterSettings extends ChildProperty<FilterSettings> {
  /**
   * Specifies the columns to be filtered at initial rendering of the Gantt.
   * You can also get the columns that were currently filtered.
   * @default []
   */
  @Collection<PredicateModel[]>([], Predicate)
  public columns: PredicateModel[];

  /**
   * Defines filter type of Gantt
   * * `Menu` - Enables menu filters in Grid.
   * @hidden
   */
  @Property('Menu')
  public type: FilterType;

  /**
   * The `operators` is used to override the default operators in filter menu. This should be defined by type wise
   * (string, number, date and boolean). Based on the column type, this customize operator list will render in filter menu.
   * @default null
   */
  @Property()
  public operators: ICustomOptr;
  /**
   * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
   * @default false
   */
  @Property(false)
  public ignoreAccent: boolean;
  /**
   * Defines the filter types. The available options are,
   * `Parent`: Shows the filtered record with parent record.
   * `Child`: Shows the filtered record with child record. 
   * `Both` : shows the filtered record with both parent and child record.
   * `None` : Shows only filtered record.
   * @default Parent
   * @isEnumeration true
   */
  @Property('Parent')
  public hierarchyMode: FilterHierarchyMode;
}