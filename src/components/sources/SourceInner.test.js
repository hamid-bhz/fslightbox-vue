import { fsLightboxStore } from "../../fsLightboxStore";
import { shallowMount } from "@vue/test-utils";
import SourceInner from "./SourceInner.vue";
import Videor from "./proper-sources/Videor.vue";

fsLightboxStore[2] = {
    componentsServices: { updateSourceInnerCollection: [] },
    core: { stageManager: { isSourceInStage: jest.fn(() => true) } },
    elements: {
        sourcesInners: [],
        sourcesComponents: [undefined, 'Videor']
    },
    props: { loadOnlyCurrentSource: true },
    stageIndexes: { current: 0 }
};

test('SourceInner', () => {
    const sourceInner = shallowMount(SourceInner, {
        propsData: {
            fsLightboxIndex: 2,
            i: 1
        }
    });

    const assertSourceNotRendered = () => {
        expect(fsLightboxStore[2].elements.sourcesInners[1]).toBe(sourceInner.element);
        expect(sourceInner.vm.$children.length).toBe(0);
    };

    assertSourceNotRendered();

    fsLightboxStore[2].componentsServices.updateSourceInnerCollection[1]();
    assertSourceNotRendered();

    fsLightboxStore[2].core.stageManager.isSourceInStage = () => true;
    fsLightboxStore[2].componentsServices.updateSourceInnerCollection[1]();
    assertSourceNotRendered();

    fsLightboxStore[2].props.loadOnlyCurrentSource = false;
    fsLightboxStore[2].componentsServices.updateSourceInnerCollection[1]();
    expect(sourceInner.vm.$children.length).toBe(1);
    expect(sourceInner.contains(Videor)).toBe(true);
    expect(sourceInner.vm.$children[0].$props).toEqual({
        fsLightboxIndex: 2,
        i: 1
    });
});
