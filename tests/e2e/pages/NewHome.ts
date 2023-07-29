import { WebActions } from "@lib/WebActions"
import type { Page } from 'playwright'
import { CommonPage } from "./Common"

export class NewHomePage extends CommonPage {
    SEARCH_BAR = `input >> nth=0`

    SEARCH_ITEM = `section[role="dialog"] >> nth=1 >> div >> nth=`

    SEARCH_ITEMS = `section[role="dialog"] >> nth=1`

    SEARCH_ITEMS_ICONS = `section[role="dialog"] >> nth=1 >> svg`

    BLOCKS_WIDGET = `main >> div >> nth=24`

    BLOCKS_WIDGET_LAST_BLOCK = `main >> div >> nth=39`

    TXNS_FIELDS = `main >> div >> nth=70 >> div >> div >> div >> div >> div >> div >> div`

    readonly page: Page

    actions: WebActions

    constructor(page: Page) {
        super(page)
        this.page = page
        this.actions = new WebActions(this.page)
    }

    async search(text: string): Promise<void> {
        await this.actions.enterElementText(this.SEARCH_BAR, text)
    }

    async checkSearchItemText(pos: number, text: string): Promise<void> {
        await this.actions.verifyElementContainsText(`${this.SEARCH_ITEM}${pos}`, text)
    }

    async findInSearchItems(text: string): Promise<void> {
        await this.actions.verifyElementIsDisplayed(`${this.SEARCH_ITEMS} >> text=/${text}/`)
    }

    async checkSearchItemsIcons(): Promise<void> {
        await this.actions.verifyElementIsDisplayed(this.SEARCH_ITEMS_ICONS)
    }

    async open(options = { waitUntil: `load` }): Promise<void> {
        await this.actions.navigateToURL(`/`, options)
    }

    async checkIndexing(): Promise<void> {
        // why any event from waitUntil is not working?
        // waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
        await this.delay(2000)
        const indexingInProgress = await this.actions.page.$(`text=/We're indexing this/`)
        if (indexingInProgress) {
            this.HEADER_STATS = `main >> div >> nth=10 >> div >> div`
        }
    }

    async check_heaader(): Promise<void> {
        await this.actions.verifyElementIsDisplayed(`${this.HEADER_STATS} >> nth=1 >> text=/\\d+/`, `total blocks are wrong`)
        await this.actions.verifyElementIsDisplayed(`${this.HEADER_STATS} >> nth=5 >> text=/\\d+.*s/`, `block time is wrong`)
        await this.actions.verifyElementIsDisplayed(`${this.HEADER_STATS} >> nth=7 >> text=/\\d+/`, `total txns is wrong`)
        await this.actions.verifyElementIsDisplayed(`${this.HEADER_STATS} >> nth=11 >> text=/\\d+/`, `total wallets is wrong`)
        await this.actions.verifyElementIsDisplayed(`${this.HEADER_STATS} >> nth=15 >> text=/.*Gwei.*/`, `no gas tracker data`)
    }

    async check_blocks_widget(): Promise<void> {
        await this.actions.verifyElementIsDisplayed(this.BLOCKS_WIDGET)
        await this.actions.verifyElementIsDisplayed(this.BLOCKS_WIDGET_LAST_BLOCK)
    }

    async check_last_block(): Promise<void> {
        await this.actions.verifyElementIsDisplayed(`${this.BLOCKS_WIDGET_LAST_BLOCK} >> div >> nth=0 >> text=/.*sec.*ago/`)
        await this.actions.verifyElementIsDisplayed(`${this.BLOCKS_WIDGET_LAST_BLOCK} >> div >> nth=4 >> text=/Txn/`)
        await this.actions.verifyElementIsDisplayed(`${this.BLOCKS_WIDGET_LAST_BLOCK} >> div >> nth=5 >> text=/\\d+/`)
        await this.actions.verifyElementIsDisplayed(`${this.BLOCKS_WIDGET_LAST_BLOCK} >> div >> nth=6 >> text=/Reward/`)
        await this.actions.verifyElementIsDisplayed(`${this.BLOCKS_WIDGET_LAST_BLOCK} >> div >> nth=7 >> text=/\\d+/`)
        await this.actions.verifyElementIsDisplayed(`${this.BLOCKS_WIDGET_LAST_BLOCK} >> div >> nth=8 >> text=/Miner/`)
        await this.actions.verifyElementIsDisplayed(`${this.BLOCKS_WIDGET_LAST_BLOCK} >> div >> a >> nth=1 >> text=/0x/`)
    }

    async check_txn_widget(): Promise<void> {
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=0 >> text=/Token transfer/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=1 >> text=/Success/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=3 >> text=/0x/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=4 >> text=/ago/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=8 >> text=/NFTV/`)

        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=9 >> text=/Contract creation/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=10 >> text=/Success/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=12 >> text=/0x/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=13 >> text=/ago/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=17 >> text=/NFTV/`)

        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=18 >> text=/Contract call/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=19 >> text=/Failed/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=21 >> text=/0x/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=22 >> text=/ago/`)
        await this.actions.verifyElementIsDisplayed(`${this.TXNS_FIELDS} >> nth=26 >> text=/EPICV/`)
    }
}
