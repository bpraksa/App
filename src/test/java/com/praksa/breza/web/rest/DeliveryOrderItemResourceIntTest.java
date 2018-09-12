package com.praksa.breza.web.rest;

import com.praksa.breza.BrezaApp;

import com.praksa.breza.domain.DeliveryOrderItem;
import com.praksa.breza.domain.DeliveryOrder;
import com.praksa.breza.domain.OnlineOrderItem;
import com.praksa.breza.repository.DeliveryOrderItemRepository;
import com.praksa.breza.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static com.praksa.breza.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the DeliveryOrderItemResource REST controller.
 *
 * @see DeliveryOrderItemResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BrezaApp.class)
public class DeliveryOrderItemResourceIntTest {

    private static final Long DEFAULT_PREPARED_AMOUNT = 1L;
    private static final Long UPDATED_PREPARED_AMOUNT = 2L;

    private static final Long DEFAULT_DELIVERED_AMOUNT = 1L;
    private static final Long UPDATED_DELIVERED_AMOUNT = 2L;

    @Autowired
    private DeliveryOrderItemRepository deliveryOrderItemRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDeliveryOrderItemMockMvc;

    private DeliveryOrderItem deliveryOrderItem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DeliveryOrderItemResource deliveryOrderItemResource = new DeliveryOrderItemResource(deliveryOrderItemRepository);
        this.restDeliveryOrderItemMockMvc = MockMvcBuilders.standaloneSetup(deliveryOrderItemResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DeliveryOrderItem createEntity(EntityManager em) {
        DeliveryOrderItem deliveryOrderItem = new DeliveryOrderItem()
            .preparedAmount(DEFAULT_PREPARED_AMOUNT)
            .deliveredAmount(DEFAULT_DELIVERED_AMOUNT);
        // Add required entity
        DeliveryOrder deliveryOrder = DeliveryOrderResourceIntTest.createEntity(em);
        em.persist(deliveryOrder);
        em.flush();
        deliveryOrderItem.setDeliveryOrder(deliveryOrder);
        // Add required entity
        OnlineOrderItem onlineOrderItem = OnlineOrderItemResourceIntTest.createEntity(em);
        em.persist(onlineOrderItem);
        em.flush();
        deliveryOrderItem.setOnlineOrderItem(onlineOrderItem);
        return deliveryOrderItem;
    }

    @Before
    public void initTest() {
        deliveryOrderItem = createEntity(em);
    }

    @Test
    @Transactional
    public void createDeliveryOrderItem() throws Exception {
        int databaseSizeBeforeCreate = deliveryOrderItemRepository.findAll().size();

        // Create the DeliveryOrderItem
        restDeliveryOrderItemMockMvc.perform(post("/api/delivery-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryOrderItem)))
            .andExpect(status().isCreated());

        // Validate the DeliveryOrderItem in the database
        List<DeliveryOrderItem> deliveryOrderItemList = deliveryOrderItemRepository.findAll();
        assertThat(deliveryOrderItemList).hasSize(databaseSizeBeforeCreate + 1);
        DeliveryOrderItem testDeliveryOrderItem = deliveryOrderItemList.get(deliveryOrderItemList.size() - 1);
        assertThat(testDeliveryOrderItem.getPreparedAmount()).isEqualTo(DEFAULT_PREPARED_AMOUNT);
        assertThat(testDeliveryOrderItem.getDeliveredAmount()).isEqualTo(DEFAULT_DELIVERED_AMOUNT);
    }

    @Test
    @Transactional
    public void createDeliveryOrderItemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = deliveryOrderItemRepository.findAll().size();

        // Create the DeliveryOrderItem with an existing ID
        deliveryOrderItem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeliveryOrderItemMockMvc.perform(post("/api/delivery-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryOrderItem)))
            .andExpect(status().isBadRequest());

        // Validate the DeliveryOrderItem in the database
        List<DeliveryOrderItem> deliveryOrderItemList = deliveryOrderItemRepository.findAll();
        assertThat(deliveryOrderItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDeliveryOrderItems() throws Exception {
        // Initialize the database
        deliveryOrderItemRepository.saveAndFlush(deliveryOrderItem);

        // Get all the deliveryOrderItemList
        restDeliveryOrderItemMockMvc.perform(get("/api/delivery-order-items?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(deliveryOrderItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].preparedAmount").value(hasItem(DEFAULT_PREPARED_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].deliveredAmount").value(hasItem(DEFAULT_DELIVERED_AMOUNT.intValue())));
    }
    

    @Test
    @Transactional
    public void getDeliveryOrderItem() throws Exception {
        // Initialize the database
        deliveryOrderItemRepository.saveAndFlush(deliveryOrderItem);

        // Get the deliveryOrderItem
        restDeliveryOrderItemMockMvc.perform(get("/api/delivery-order-items/{id}", deliveryOrderItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(deliveryOrderItem.getId().intValue()))
            .andExpect(jsonPath("$.preparedAmount").value(DEFAULT_PREPARED_AMOUNT.intValue()))
            .andExpect(jsonPath("$.deliveredAmount").value(DEFAULT_DELIVERED_AMOUNT.intValue()));
    }
    @Test
    @Transactional
    public void getNonExistingDeliveryOrderItem() throws Exception {
        // Get the deliveryOrderItem
        restDeliveryOrderItemMockMvc.perform(get("/api/delivery-order-items/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDeliveryOrderItem() throws Exception {
        // Initialize the database
        deliveryOrderItemRepository.saveAndFlush(deliveryOrderItem);

        int databaseSizeBeforeUpdate = deliveryOrderItemRepository.findAll().size();

        // Update the deliveryOrderItem
        DeliveryOrderItem updatedDeliveryOrderItem = deliveryOrderItemRepository.findById(deliveryOrderItem.getId()).get();
        // Disconnect from session so that the updates on updatedDeliveryOrderItem are not directly saved in db
        em.detach(updatedDeliveryOrderItem);
        updatedDeliveryOrderItem
            .preparedAmount(UPDATED_PREPARED_AMOUNT)
            .deliveredAmount(UPDATED_DELIVERED_AMOUNT);

        restDeliveryOrderItemMockMvc.perform(put("/api/delivery-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDeliveryOrderItem)))
            .andExpect(status().isOk());

        // Validate the DeliveryOrderItem in the database
        List<DeliveryOrderItem> deliveryOrderItemList = deliveryOrderItemRepository.findAll();
        assertThat(deliveryOrderItemList).hasSize(databaseSizeBeforeUpdate);
        DeliveryOrderItem testDeliveryOrderItem = deliveryOrderItemList.get(deliveryOrderItemList.size() - 1);
        assertThat(testDeliveryOrderItem.getPreparedAmount()).isEqualTo(UPDATED_PREPARED_AMOUNT);
        assertThat(testDeliveryOrderItem.getDeliveredAmount()).isEqualTo(UPDATED_DELIVERED_AMOUNT);
    }

    @Test
    @Transactional
    public void updateNonExistingDeliveryOrderItem() throws Exception {
        int databaseSizeBeforeUpdate = deliveryOrderItemRepository.findAll().size();

        // Create the DeliveryOrderItem

        // If the entity doesn't have an ID, it will throw BadRequestAlertException 
        restDeliveryOrderItemMockMvc.perform(put("/api/delivery-order-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryOrderItem)))
            .andExpect(status().isBadRequest());

        // Validate the DeliveryOrderItem in the database
        List<DeliveryOrderItem> deliveryOrderItemList = deliveryOrderItemRepository.findAll();
        assertThat(deliveryOrderItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDeliveryOrderItem() throws Exception {
        // Initialize the database
        deliveryOrderItemRepository.saveAndFlush(deliveryOrderItem);

        int databaseSizeBeforeDelete = deliveryOrderItemRepository.findAll().size();

        // Get the deliveryOrderItem
        restDeliveryOrderItemMockMvc.perform(delete("/api/delivery-order-items/{id}", deliveryOrderItem.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DeliveryOrderItem> deliveryOrderItemList = deliveryOrderItemRepository.findAll();
        assertThat(deliveryOrderItemList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DeliveryOrderItem.class);
        DeliveryOrderItem deliveryOrderItem1 = new DeliveryOrderItem();
        deliveryOrderItem1.setId(1L);
        DeliveryOrderItem deliveryOrderItem2 = new DeliveryOrderItem();
        deliveryOrderItem2.setId(deliveryOrderItem1.getId());
        assertThat(deliveryOrderItem1).isEqualTo(deliveryOrderItem2);
        deliveryOrderItem2.setId(2L);
        assertThat(deliveryOrderItem1).isNotEqualTo(deliveryOrderItem2);
        deliveryOrderItem1.setId(null);
        assertThat(deliveryOrderItem1).isNotEqualTo(deliveryOrderItem2);
    }
}
