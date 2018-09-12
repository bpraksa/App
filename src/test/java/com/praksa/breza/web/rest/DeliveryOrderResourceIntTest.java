package com.praksa.breza.web.rest;

import com.praksa.breza.BrezaApp;

import com.praksa.breza.domain.DeliveryOrder;
import com.praksa.breza.domain.OnlineOrder;
import com.praksa.breza.repository.DeliveryOrderRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static com.praksa.breza.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the DeliveryOrderResource REST controller.
 *
 * @see DeliveryOrderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BrezaApp.class)
public class DeliveryOrderResourceIntTest {

    private static final LocalDate DEFAULT_DELIVERY_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DELIVERY_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    @Autowired
    private DeliveryOrderRepository deliveryOrderRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDeliveryOrderMockMvc;

    private DeliveryOrder deliveryOrder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DeliveryOrderResource deliveryOrderResource = new DeliveryOrderResource(deliveryOrderRepository);
        this.restDeliveryOrderMockMvc = MockMvcBuilders.standaloneSetup(deliveryOrderResource)
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
    public static DeliveryOrder createEntity(EntityManager em) {
        DeliveryOrder deliveryOrder = new DeliveryOrder()
            .deliveryDate(DEFAULT_DELIVERY_DATE)
            .status(DEFAULT_STATUS);
        // Add required entity
        OnlineOrder onlineOrder = OnlineOrderResourceIntTest.createEntity(em);
        em.persist(onlineOrder);
        em.flush();
        deliveryOrder.setOnlineOrder(onlineOrder);
        return deliveryOrder;
    }

    @Before
    public void initTest() {
        deliveryOrder = createEntity(em);
    }

    @Test
    @Transactional
    public void createDeliveryOrder() throws Exception {
        int databaseSizeBeforeCreate = deliveryOrderRepository.findAll().size();

        // Create the DeliveryOrder
        restDeliveryOrderMockMvc.perform(post("/api/delivery-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryOrder)))
            .andExpect(status().isCreated());

        // Validate the DeliveryOrder in the database
        List<DeliveryOrder> deliveryOrderList = deliveryOrderRepository.findAll();
        assertThat(deliveryOrderList).hasSize(databaseSizeBeforeCreate + 1);
        DeliveryOrder testDeliveryOrder = deliveryOrderList.get(deliveryOrderList.size() - 1);
        assertThat(testDeliveryOrder.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testDeliveryOrder.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createDeliveryOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = deliveryOrderRepository.findAll().size();

        // Create the DeliveryOrder with an existing ID
        deliveryOrder.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeliveryOrderMockMvc.perform(post("/api/delivery-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryOrder)))
            .andExpect(status().isBadRequest());

        // Validate the DeliveryOrder in the database
        List<DeliveryOrder> deliveryOrderList = deliveryOrderRepository.findAll();
        assertThat(deliveryOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = deliveryOrderRepository.findAll().size();
        // set the field null
        deliveryOrder.setStatus(null);

        // Create the DeliveryOrder, which fails.

        restDeliveryOrderMockMvc.perform(post("/api/delivery-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryOrder)))
            .andExpect(status().isBadRequest());

        List<DeliveryOrder> deliveryOrderList = deliveryOrderRepository.findAll();
        assertThat(deliveryOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDeliveryOrders() throws Exception {
        // Initialize the database
        deliveryOrderRepository.saveAndFlush(deliveryOrder);

        // Get all the deliveryOrderList
        restDeliveryOrderMockMvc.perform(get("/api/delivery-orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(deliveryOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].deliveryDate").value(hasItem(DEFAULT_DELIVERY_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    

    @Test
    @Transactional
    public void getDeliveryOrder() throws Exception {
        // Initialize the database
        deliveryOrderRepository.saveAndFlush(deliveryOrder);

        // Get the deliveryOrder
        restDeliveryOrderMockMvc.perform(get("/api/delivery-orders/{id}", deliveryOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(deliveryOrder.getId().intValue()))
            .andExpect(jsonPath("$.deliveryDate").value(DEFAULT_DELIVERY_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingDeliveryOrder() throws Exception {
        // Get the deliveryOrder
        restDeliveryOrderMockMvc.perform(get("/api/delivery-orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDeliveryOrder() throws Exception {
        // Initialize the database
        deliveryOrderRepository.saveAndFlush(deliveryOrder);

        int databaseSizeBeforeUpdate = deliveryOrderRepository.findAll().size();

        // Update the deliveryOrder
        DeliveryOrder updatedDeliveryOrder = deliveryOrderRepository.findById(deliveryOrder.getId()).get();
        // Disconnect from session so that the updates on updatedDeliveryOrder are not directly saved in db
        em.detach(updatedDeliveryOrder);
        updatedDeliveryOrder
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .status(UPDATED_STATUS);

        restDeliveryOrderMockMvc.perform(put("/api/delivery-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDeliveryOrder)))
            .andExpect(status().isOk());

        // Validate the DeliveryOrder in the database
        List<DeliveryOrder> deliveryOrderList = deliveryOrderRepository.findAll();
        assertThat(deliveryOrderList).hasSize(databaseSizeBeforeUpdate);
        DeliveryOrder testDeliveryOrder = deliveryOrderList.get(deliveryOrderList.size() - 1);
        assertThat(testDeliveryOrder.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testDeliveryOrder.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingDeliveryOrder() throws Exception {
        int databaseSizeBeforeUpdate = deliveryOrderRepository.findAll().size();

        // Create the DeliveryOrder

        // If the entity doesn't have an ID, it will throw BadRequestAlertException 
        restDeliveryOrderMockMvc.perform(put("/api/delivery-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(deliveryOrder)))
            .andExpect(status().isBadRequest());

        // Validate the DeliveryOrder in the database
        List<DeliveryOrder> deliveryOrderList = deliveryOrderRepository.findAll();
        assertThat(deliveryOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDeliveryOrder() throws Exception {
        // Initialize the database
        deliveryOrderRepository.saveAndFlush(deliveryOrder);

        int databaseSizeBeforeDelete = deliveryOrderRepository.findAll().size();

        // Get the deliveryOrder
        restDeliveryOrderMockMvc.perform(delete("/api/delivery-orders/{id}", deliveryOrder.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DeliveryOrder> deliveryOrderList = deliveryOrderRepository.findAll();
        assertThat(deliveryOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DeliveryOrder.class);
        DeliveryOrder deliveryOrder1 = new DeliveryOrder();
        deliveryOrder1.setId(1L);
        DeliveryOrder deliveryOrder2 = new DeliveryOrder();
        deliveryOrder2.setId(deliveryOrder1.getId());
        assertThat(deliveryOrder1).isEqualTo(deliveryOrder2);
        deliveryOrder2.setId(2L);
        assertThat(deliveryOrder1).isNotEqualTo(deliveryOrder2);
        deliveryOrder1.setId(null);
        assertThat(deliveryOrder1).isNotEqualTo(deliveryOrder2);
    }
}
