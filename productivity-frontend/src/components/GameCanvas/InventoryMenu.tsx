import { useContext, useEffect, useState } from 'react'
import styles from './GameCanvas.module.css';
import CurrencyIcon from './CurrencyIcon';
import useGetRequest from '../../hooks/useGetRequest';
import { AuthUserData, ItemUserData } from '../../types';
import { BalanceContext } from '../../pages/TaskPage/TaskPage';

interface ItemInputs {
  user?: AuthUserData
}

export default function InventoryMenu(inData: ItemInputs) {

  const { userBalance, setUserBalance } = useContext(BalanceContext);

  // GET Request: item data from database
  const { data, sendRequest } = useGetRequest<ItemUserData[]>('items');
  const [itemData, setItemData] = useState<ItemUserData[] | null>(null);  // stores item manifest
  const [invTab, setInvTab] = useState(0);                                // handle switching inventory tabs
  const [tabColor, setTabColor] = useState([true, false, false]);         // manage styles to change color on selection
  const [showPurchase, setShowPurchase] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemUserData | null>(null);

  // gets user data from Context
  const user = inData.user;

  // get initial item table
  useEffect(() => {
    if (user) sendRequest({ user_id: String(user.id) });
  }, [sendRequest, user]);

  // Add the items to local state
  useEffect(() => {
    if (data) setItemData(data);
  }, [data, setItemData]);

  // switch the active tab for filtering and styling
  function updateInvTab(invType: number) {
    console.log("Item Data", data);
    const tabTemp = tabColor;
    tabTemp[invTab] = false;
    tabTemp[invType] = true;

    setTabColor(tabTemp);
    setInvTab(invType);
  }

  function purchaseBox() {
    return (
      <>
        <button className={styles.inventoryPurchaseButton} onClick={() => purchaseSelectedItem()}>
          Purchase
        </button>
        <p className={styles.inventoryCostText}>{selectedItem?.item_cost}</p>
      </>
    )
  }

  function updatePurchaseBox(show: boolean, item: ItemUserData) {
    // adding an if statement so typescript shuts up
    if (itemData) {
      setShowPurchase(show);
      setSelectedItem(item);
    }
  }

  function purchaseSelectedItem() {
    if (itemData && selectedItem) {
      // TODO: post request to actually buy the thing
      setUserBalance((userBalance as number) - (selectedItem as ItemUserData).item_cost);
      setShowPurchase(false);

      const tempItems = itemData;
      const selection = tempItems.find((item) => item.id == selectedItem.id);
      
      Object.assign(selection as ItemUserData, {...selectedItem, owned: true})
      
      setItemData(tempItems);

    }
  }

  // Generate the item inventory based on the currently selected tab
  function buildItemGrid() {
    if (itemData) {
      // get items that match the current inventory tab
      let i_type = '';
      switch (invTab) {
        case 0:
          i_type = 'shirt';
          break;

        case 1:
          i_type = 'shoes';
          break;

        case 2:
          i_type = 'skin'
          break;

        default:
          // probably should make this something else later
          i_type = 'error'
      }

      // make a new array with just those items
      const tab_items = itemData.filter((item) => item.item_type === i_type);

      // map those items into some html
      const item_grid = tab_items.map((item, idx) =>
        <div className={styles.inventoryGridItem} key={'GI_' + idx}>
          <div className={styles.inventoryItemBox} key={idx}
            style={{ backgroundColor: item.owned ? "white" : "grey" }}
            onClick={() => updatePurchaseBox(true, item)} />
          <p className={styles.inventoryGridItemText} key={'Text_' + idx}>
            {item.name}
          </p>
        </div>
      );

      return item_grid;
    }
  }

  return (
    <>
      <div className={styles.inventoryDiv}>
        <div className={styles.inventoryTabDiv}>

          <div className={styles.inventroyTab} onClick={() => updateInvTab(0)} style={{ backgroundColor: tabColor[0] ? "grey" : "white" }}>
            <p className={styles.inventoryTabText}>Shirts</p>
          </div>
          <div className={styles.inventroyTab} onClick={() => updateInvTab(1)} style={{ backgroundColor: tabColor[1] ? "grey" : "white" }}>
            <p className={styles.inventoryTabText}>Shoes</p>
          </div>
          <div className={styles.inventroyTab} onClick={() => updateInvTab(2)} style={{ backgroundColor: tabColor[2] ? "grey" : "white" }}>
            <p className={styles.inventoryTabText}>Skins</p>
          </div>

          <div className={styles.inventoryCurrencyDiv}>
            <div className={styles.inventoryCurrencyIconDiv}>
              <CurrencyIcon />
            </div>
            <p className={styles.inventoryCurrencyCount}>
              {userBalance}
            </p>
          </div>
        </div>

        <div className={styles.inventoryGrid}>
          {buildItemGrid()}
        </div>

        <div className={styles.inventoryPurchaseDiv}>
          {showPurchase ? purchaseBox() : null}
        </div>
      </div >
    </>
  )
}